const BASE_URL = "http://www.wikicfp.com";
const SEARCH_URL = `${BASE_URL}/cfp/servlet/tool.search`;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

const TOOLS = [
  {
    name: "get_events",
    description: "Search for conferences matching specific keywords on WikiCFP.",
    inputSchema: {
      type: "object",
      properties: {
        keywords: {
          type: "string",
          description: "Search terms for conferences.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of events to return.",
          default: 10,
        },
      },
      required: ["keywords"],
    },
  },
];

function writeMessage(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function jsonRpcResult(id, result) {
  return { jsonrpc: "2.0", id, result };
}

function jsonRpcError(id, code, message) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

function initializationResult() {
  return {
    protocolVersion: "2024-11-05",
    capabilities: { tools: {} },
    serverInfo: {
      name: "call-for-papers-mcp",
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

function decodeHtmlEntities(text) {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function stripTags(text) {
  return decodeHtmlEntities(
    text
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function extractHref(cellHtml) {
  const match = cellHtml.match(/<a[^>]+href="([^"]+)"/i);
  if (!match) {
    return "";
  }

  if (match[1].startsWith("http://") || match[1].startsWith("https://")) {
    return match[1];
  }

  return `${BASE_URL}${match[1]}`;
}

function parseConferencePair(firstRowHtml, secondRowHtml) {
  const firstCells = [...firstRowHtml.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map((match) => match[1]);
  const secondCells = [...secondRowHtml.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map((match) => match[1]);

  if (firstCells.length === 0) {
    return null;
  }

  const nameCellHtml = firstCells[0];
  const eventName = stripTags(nameCellHtml);
  const eventLink = extractHref(nameCellHtml);
  const conferenceDescription = firstCells.length > 1 ? stripTags(firstCells[1]) : "";

  let eventTime = "";
  let eventLocation = "";
  let deadline = "";
  if (secondCells.length >= 3) {
    [eventTime, eventLocation, deadline] = secondCells.slice(0, 3).map(stripTags);
  }

  const description = conferenceDescription ||
    [eventLocation ? `Location: ${eventLocation}` : "", deadline ? `Deadline: ${deadline}` : ""]
      .filter(Boolean)
      .join(" | ") ||
    "Conference";

  return {
    event_name: eventName,
    event_description: conferenceDescription,
    event_time: eventTime,
    event_location: eventLocation,
    deadline,
    description,
    event_link: eventLink,
  };
}

function parseConferenceTable(tableHtml) {
  const rows = [...tableHtml.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((match) => match[1]);
  if (rows.length <= 1) {
    return [];
  }

  const contentRows = rows.slice(1);
  const conferences = [];
  for (let index = 0; index + 1 < contentRows.length; index += 2) {
    const conference = parseConferencePair(contentRows[index], contentRows[index + 1]);
    if (conference) {
      conferences.push(conference);
    }
  }
  return conferences;
}

function findConferenceTables(html) {
  const tables = [];
  const tableRegex = /<table\b([^>]*)>([\s\S]*?)<\/table>/gi;
  let match;
  while ((match = tableRegex.exec(html)) !== null) {
    const attrs = match[1] ?? "";
    const tableHtml = match[0];
    if (!/cellpadding\s*=\s*["']?2["']?/i.test(attrs) || !/cellspacing\s*=\s*["']?1["']?/i.test(attrs)) {
      continue;
    }
    if (!/<tr[^>]*bgcolor=["']#bbbbbb["']/i.test(tableHtml)) {
      continue;
    }
    tables.push(tableHtml);
  }
  return tables;
}

async function getEvents(keywords, limit = 10) {
  const url = new URL(SEARCH_URL);
  url.searchParams.set("q", keywords);
  url.searchParams.set("year", "t");

  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`WikiCFP request failed with status ${response.status}`);
  }

  const html = await response.text();
  const tables = findConferenceTables(html);
  const conferences = tables.flatMap(parseConferenceTable);
  const capped = Number.isInteger(limit) && limit > 0 ? conferences.slice(0, limit) : conferences;

  return {
    status: "success",
    count: capped.length,
    events: capped,
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
  if (name !== "get_events") {
    return jsonRpcError(id, -32601, `Unknown tool: ${name}`);
  }
  if (!args.keywords) {
    throw new Error("Missing required argument: keywords");
  }

  const limit = Number.isFinite(args.limit) ? Number(args.limit) : 10;
  const result = await getEvents(String(args.keywords), limit);
  return jsonRpcResult(id, makeTextResult(result));
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
