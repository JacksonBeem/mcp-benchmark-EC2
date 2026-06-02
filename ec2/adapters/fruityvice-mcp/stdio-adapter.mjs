function writeMessage(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function jsonRpcResult(id, result) {
  return { jsonrpc: "2.0", id, result };
}

function jsonRpcError(id, code, message) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

async function getFruitInfo(fruitName) {
  const url = `https://www.fruityvice.com/api/fruit/${encodeURIComponent(fruitName)}`;
  const response = await fetch(url);

  if (response.status === 404) {
    return { error: `Fruit '${fruitName}' not found` };
  }
  if (!response.ok) {
    return { error: `Failed to retrieve data from API. Status code: ${response.status}` };
  }

  const data = await response.json();
  return {
    name: data?.name ?? "Unknown",
    family: data?.family ?? "Unknown",
    genus: data?.genus ?? "Unknown",
    order: data?.order ?? "Unknown",
    nutritions: data?.nutritions ?? {},
    id: data?.id ?? "Unknown",
  };
}

const TOOLS = [
  {
    name: "get_fruit_nutrition",
    description: "Get nutritional information and details for a given fruit name.",
    inputSchema: {
      type: "object",
      properties: {
        fruit_name: {
          type: "string",
          description: "The name of the fruit to get information about.",
        },
      },
      required: ["fruit_name"],
    },
  },
];

function initializationResult() {
  return {
    protocolVersion: "2024-11-05",
    capabilities: { tools: {} },
    serverInfo: {
      name: "fruityvice-mcp",
      version: "1.0.0",
    },
  };
}

function makeTextResult(payload) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(payload, null, 2),
      },
    ],
  };
}

async function handleRequest(message) {
  const id = message.id ?? null;

  if (message.method === "initialize") {
    return jsonRpcResult(id, initializationResult());
  }
  if (message.method === "notifications/initialized") {
    return null;
  }
  if (message.method === "tools/list") {
    return jsonRpcResult(id, { tools: TOOLS });
  }
  if (message.method !== "tools/call") {
    return jsonRpcError(id, -32601, `Method not found: ${message.method}`);
  }

  const name = message.params?.name;
  const args = message.params?.arguments ?? {};
  if (name !== "get_fruit_nutrition") {
    return jsonRpcError(id, -32601, `Unknown tool: ${name}`);
  }
  if (!args.fruit_name) {
    throw new Error("Missing required argument: fruit_name");
  }

  return jsonRpcResult(id, makeTextResult(await getFruitInfo(String(args.fruit_name))));
}

let buffer = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", async (chunk) => {
  buffer += chunk;
  const lines = buffer.split("\n");
  buffer = lines.pop() ?? "";

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      continue;
    }

    let message;
    try {
      message = JSON.parse(line);
    } catch {
      writeMessage(jsonRpcError(null, -32700, "Parse error"));
      continue;
    }

    try {
      const response = await handleRequest(message);
      if (response) {
        writeMessage(response);
      }
    } catch (error) {
      writeMessage(
        jsonRpcError(
          message.id ?? null,
          -32603,
          error instanceof Error ? error.message : String(error),
        ),
      );
    }
  }
});

process.stdin.on("end", () => {
  process.exit(0);
});
