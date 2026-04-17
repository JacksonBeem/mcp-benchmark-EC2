const API_KEY = process.env.TMDB_API_KEY || "c6fae702c36224d5f01778d394772520";

function writeMessage(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function jsonRpcResult(id, result) {
  return { jsonrpc: "2.0", id, result };
}

function jsonRpcError(id, code, message) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

async function getMovieSuggestions(keyword) {
  const url = new URL("https://api.themoviedb.org/3/search/movie");
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("query", keyword);

  const response = await fetch(url);
  if (!response.ok) {
    return "API istegi basarisiz oldu.";
  }

  const data = await response.json();
  if (!data?.results || data.results.length === 0) {
    return "Film bulunamadi.";
  }

  return data.results.slice(0, 3).map((movie) => {
    const title = movie?.title ?? "Bilinmiyor";
    const overview = movie?.overview ?? "Aciklama yok.";
    return `${title}\n${overview}`;
  }).join("\n\n");
}

const TOOLS = [
  {
    name: "get_movies",
    description: "Get movie suggestions based on keyword.",
    inputSchema: {
      type: "object",
      properties: {
        keyword: {
          type: "string",
          description: "Keyword to search for matching movies.",
        },
      },
      required: ["keyword"],
    },
  },
];

function initializationResult() {
  return {
    protocolVersion: "2024-11-05",
    capabilities: { tools: {} },
    serverInfo: {
      name: "movie-recommender-mcp",
      version: "1.0.0",
    },
  };
}

function makeTextResult(payload) {
  return {
    content: [
      {
        type: "text",
        text: String(payload),
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
  if (name !== "get_movies") {
    return jsonRpcError(id, -32601, `Unknown tool: ${name}`);
  }
  if (!args.keyword) {
    throw new Error("Missing required argument: keyword");
  }

  return jsonRpcResult(id, makeTextResult(await getMovieSuggestions(String(args.keyword))));
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
