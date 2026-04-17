function writeMessage(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function jsonRpcResult(id, result) {
  return {
    jsonrpc: "2.0",
    id,
    result,
  };
}

function jsonRpcError(id, code, message) {
  return {
    jsonrpc: "2.0",
    id,
    error: {
      code,
      message,
    },
  };
}

function getFormatter(timeZone) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
}

function validateTimeZone(timeZone) {
  try {
    getFormatter(timeZone).format(new Date());
  } catch (error) {
    throw new Error(`Invalid timezone: ${error.message}`);
  }
}

function getDateTimeParts(date, timeZone) {
  const parts = getFormatter(timeZone).formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
  };
}

function getOffsetMinutes(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "longOffset",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const offsetPart = parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT";
  if (offsetPart === "GMT") {
    return 0;
  }

  const match = offsetPart.match(/^GMT([+-])(\d{2}):(\d{2})$/);
  if (!match) {
    throw new Error(`Unsupported timezone offset format: ${offsetPart}`);
  }

  const sign = match[1] === "+" ? 1 : -1;
  return sign * (Number(match[2]) * 60 + Number(match[3]));
}

function formatOffset(minutes) {
  const sign = minutes >= 0 ? "+" : "-";
  const absolute = Math.abs(minutes);
  const hours = String(Math.floor(absolute / 60)).padStart(2, "0");
  const mins = String(absolute % 60).padStart(2, "0");
  return `${sign}${hours}:${mins}`;
}

function formatIsoInTimeZone(date, timeZone) {
  const parts = getDateTimeParts(date, timeZone);
  const offset = getOffsetMinutes(date, timeZone);
  return `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}T${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}:${String(parts.second).padStart(2, "0")}${formatOffset(offset)}`;
}

function isDst(date, timeZone) {
  const year = getDateTimeParts(date, timeZone).year;
  const januaryOffset = getOffsetMinutes(new Date(Date.UTC(year, 0, 1, 12, 0, 0)), timeZone);
  const julyOffset = getOffsetMinutes(new Date(Date.UTC(year, 6, 1, 12, 0, 0)), timeZone);
  const standardOffset = Math.min(januaryOffset, julyOffset);
  return getOffsetMinutes(date, timeZone) !== standardOffset;
}

function currentTimeResult(timeZone) {
  validateTimeZone(timeZone);
  const now = new Date();
  return {
    timezone: timeZone,
    datetime: formatIsoInTimeZone(now, timeZone),
    is_dst: isDst(now, timeZone),
  };
}

function parseTimeString(value) {
  const match = String(value).match(/^(\d{2}):(\d{2})$/);
  if (!match) {
    throw new Error("Invalid time format. Expected HH:MM [24-hour format]");
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) {
    throw new Error("Invalid time format. Expected HH:MM [24-hour format]");
  }
  return { hour, minute };
}

function zonedDateToUtcMillis({ year, month, day, hour, minute }, timeZone) {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, 0);
  let offset = getOffsetMinutes(new Date(utcGuess), timeZone);
  let timestamp = utcGuess - offset * 60_000;
  const resolvedOffset = getOffsetMinutes(new Date(timestamp), timeZone);
  if (resolvedOffset !== offset) {
    offset = resolvedOffset;
    timestamp = utcGuess - offset * 60_000;
  }
  return timestamp;
}

function formatTimeDifference(sourceOffsetMinutes, targetOffsetMinutes) {
  const hoursDifference = (targetOffsetMinutes - sourceOffsetMinutes) / 60;
  if (Number.isInteger(hoursDifference)) {
    return `${hoursDifference >= 0 ? "+" : ""}${hoursDifference.toFixed(1)}h`;
  }
  return `${hoursDifference >= 0 ? "+" : ""}${String(Number(hoursDifference.toFixed(2)))}h`;
}

function convertTime(sourceTimeZone, timeString, targetTimeZone) {
  validateTimeZone(sourceTimeZone);
  validateTimeZone(targetTimeZone);
  const parsed = parseTimeString(timeString);
  const now = new Date();
  const sourceNowParts = getDateTimeParts(now, sourceTimeZone);
  const timestamp = zonedDateToUtcMillis(
    {
      year: sourceNowParts.year,
      month: sourceNowParts.month,
      day: sourceNowParts.day,
      hour: parsed.hour,
      minute: parsed.minute,
    },
    sourceTimeZone,
  );
  const sourceDate = new Date(timestamp);
  const sourceOffset = getOffsetMinutes(sourceDate, sourceTimeZone);
  const targetOffset = getOffsetMinutes(sourceDate, targetTimeZone);

  return {
    source: {
      timezone: sourceTimeZone,
      datetime: formatIsoInTimeZone(sourceDate, sourceTimeZone),
      is_dst: isDst(sourceDate, sourceTimeZone),
    },
    target: {
      timezone: targetTimeZone,
      datetime: formatIsoInTimeZone(sourceDate, targetTimeZone),
      is_dst: isDst(sourceDate, targetTimeZone),
    },
    time_difference: formatTimeDifference(sourceOffset, targetOffset),
  };
}

const toolDefinitions = [
  {
    name: "get_current_time",
    description: "Get current time in a specific timezones",
    inputSchema: {
      type: "object",
      properties: {
        timezone: {
          type: "string",
          description: "IANA timezone name such as America/New_York or Europe/London.",
        },
      },
      required: ["timezone"],
    },
  },
  {
    name: "convert_time",
    description: "Convert time between timezones",
    inputSchema: {
      type: "object",
      properties: {
        source_timezone: {
          type: "string",
          description: "Source IANA timezone name.",
        },
        time: {
          type: "string",
          description: "Time to convert in 24-hour format (HH:MM).",
        },
        target_timezone: {
          type: "string",
          description: "Target IANA timezone name.",
        },
      },
      required: ["source_timezone", "time", "target_timezone"],
    },
  },
];

function getInitializeResult() {
  return {
    protocolVersion: "2024-11-05",
    capabilities: {
      tools: {},
    },
    serverInfo: {
      name: "mcp-time",
      version: "1.0.0",
    },
  };
}

async function handleRequest(message) {
  const id = message.id ?? null;

  if (message.method === "initialize") {
    return jsonRpcResult(id, getInitializeResult());
  }
  if (message.method === "notifications/initialized") {
    return null;
  }
  if (message.method === "tools/list") {
    return jsonRpcResult(id, { tools: toolDefinitions });
  }
  if (message.method === "tools/call") {
    const name = message.params?.name;
    const args = message.params?.arguments ?? {};

    if (name === "get_current_time") {
      if (!args.timezone) {
        throw new Error("Missing required argument: timezone");
      }
      return jsonRpcResult(id, {
        content: [
          {
            type: "text",
            text: JSON.stringify(currentTimeResult(args.timezone), null, 2),
          },
        ],
      });
    }

    if (name === "convert_time") {
      if (!args.source_timezone || !args.time || !args.target_timezone) {
        throw new Error("Missing required arguments");
      }
      return jsonRpcResult(id, {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              convertTime(args.source_timezone, args.time, args.target_timezone),
              null,
              2,
            ),
          },
        ],
      });
    }

    return jsonRpcError(id, -32601, `Unknown tool: ${name}`);
  }

  return jsonRpcError(id, -32601, `Method not found: ${message.method}`);
}

let buffer = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", async (chunk) => {
  buffer += chunk;
  const lines = buffer.split("\n");
  buffer = lines.pop() ?? "";

  for (const rawLine of lines) {
    const line = rawLine.trim();
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
          `Error processing mcp-server-time query: ${error.message}`,
        ),
      );
    }
  }
});

process.stdin.on("end", () => {
  process.exit(0);
});
