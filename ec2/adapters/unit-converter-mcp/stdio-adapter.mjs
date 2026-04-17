const ANGLE_TO_DEGREES = {
  degrees: 1,
  radians: 180 / Math.PI,
  arcmin: 1 / 60,
  arcsec: 1 / 3600,
  turns: 360,
  gons: 0.9,
};

const AREA_TO_SQUARE_METERS = {
  acre: 4046.8564224,
  are: 100,
  hectare: 10000,
  "square centimeter": 0.0001,
  "square foot": 0.09290304,
  "square inch": 0.00064516,
  "square kilometer": 1000000,
  "square meter": 1,
  "square mile": 2589988.110336,
  "square millimeter": 1e-6,
  "square yard": 0.83612736,
};

const COMPUTER_TO_MEGABYTES = {
  bits: 1.19209e-7,
  bytes: 9.53674e-7,
  kilobytes: 0.0009765625,
  megabytes: 1,
  gigabytes: 1024,
  terabytes: 1048576,
  petabytes: 1073741824,
  exabytes: 1099511627776,
};

const DENSITY_TO_KILOGRAMS_PER_LITER = {
  "grains per gallon (UK)": 1.4253948e-5,
  "grains per gallon (US)": 1.7118012e-5,
  "grains per gallon": 1.7118012e-5,
  "grams per cubic centimeter": 1,
  "grams per liter": 0.001,
  "kilograms per liter": 1,
  "kilograms per cubic meter": 0.001,
  "milligrams per liter": 1e-6,
  "ounces per gallon (UK)": 0.006236023,
  "ounces per gallon (US)": 0.007489152,
  "ounces per gallon": 0.007489152,
  "pounds per cubic foot": 0.016018463,
  "pounds per gallon (UK)": 0.099776373,
  "pounds per gallon (US)": 0.119826427,
  "pounds per gallon": 0.119826427,
  "tonnes per cubic meter": 1,
  "tons per cubic yard (UK)": 1.328939184,
  "tons per cubic yard (US)": 1.186552843,
  "tons per cubic yard": 1.186552843,
};

const ENERGY_TO_JOULES = {
  joule: 1,
  kilojoule: 1000,
  megajoule: 1000000,
  gigajoule: 1000000000,
  terajoule: 1000000000000,
  petajoule: 1000000000000000,
  exajoule: 1000000000000000000,
  "watt hour": 3600,
  "kilowatt hour": 3600000,
  "megawatt hour": 3600000000,
  "gigawatt hour": 3600000000000,
  "terawatt hour": 3600000000000000,
  Btu: 1054.35,
  calorie: 4.184,
  kilocalorie: 4184,
  therm: 105505585.257348,
  "foot-pound force": 1.355817948331,
  "inch-pound force": 0.112984829028,
  erg: 1e-7,
  "electron volt": 1.602176634e-19,
};

const FORCE_TO_NEWTONS = {
  dynes: 1e-5,
  "kilograms force": 9.80665,
  kilonewtons: 1000,
  kips: 4448.222,
  meganewtons: 1000000,
  newtons: 1,
  "pounds force": 4.44822161526,
  "tonnes force": 9806.65,
  "long tons force": 9964.01641818352,
  "short tons force": 8896.443230521,
};

const LENGTH_TO_METERS = {
  angstrom: 1e-10,
  "astronomical unit": 149598550000,
  cable: 182.88,
  centimeter: 0.01,
  "chain (surveyors)": 20.11684023368,
  decimeter: 0.1,
  "em (pica)": 0.0042333,
  fathom: 1.8288,
  foot: 0.3048,
  "foot (US survey)": 0.304800609601,
  furlong: 201.168,
  hand: 0.1016,
  hectometer: 100,
  inch: 0.0254,
  kilometer: 1000,
  "light year": 9460528405000000,
  meter: 1,
  micrometer: 1e-6,
  mil: 2.54e-5,
  mile: 1609.344,
  "nautical mile": 1852,
  "nautical mile (UK)": 1853.184,
  millimeter: 0.001,
  nanometer: 1e-9,
  parsec: 30856776000000000,
  picometer: 1e-12,
  "Scandinavian mile": 10000,
  thou: 2.54e-5,
  yard: 0.9144,
};

const MASS_TO_KILOGRAMS = {
  carat: 0.0002,
  decagram: 0.01,
  hectogram: 0.1,
  gram: 0.001,
  milligram: 1e-6,
  microgram: 1e-9,
  nanogram: 1e-12,
  picogram: 1e-15,
  femtogram: 1e-18,
  grain: 6.479891e-5,
  ounce: 0.028349523125,
  "troy ounce": 0.0311034768,
  pound: 0.45359237,
  stone: 6.35029318,
  "short ton (US)": 907.18474,
  "long ton (UK)": 1016.0469088,
  tonne: 1000,
  kilotonne: 1000000,
  megatonne: 1000000000,
  kilogram: 1,
};

const POWER_TO_WATTS = {
  "Btu per hour": 0.2930711,
  "foot-pound force per second": 1.35582,
  "ton of refrigeration": 3516.853,
  "calorie per hour": 0.001162222222,
  "kilocalorie per hour": 1.162222222222,
  horsepower: 745.69987158227,
  "horsepower (metric)": 735.4988,
  "kilogram-force meter per second": 9.80665,
  watt: 1,
  kilowatt: 1000,
  megawatt: 1000000,
  gigawatt: 1000000000,
  terawatt: 1000000000000,
  petawatt: 1000000000000000,
};

const PRESSURE_TO_PASCALS = {
  pascal: 1,
  hectopascal: 100,
  kilopascal: 1000,
  megapascal: 1000000,
  bar: 100000,
  atmosphere: 101325,
  "centimeters of water": 98.0665,
  "inches of water": 249.08891,
  "feet of water": 2989.06692,
  "meters of water": 9806.65,
  "millimeters of mercury": 133.322,
  "inches of mercury": 3386.388,
  "kilogram force per square centimeter": 98066.5,
  "newtons per square centimeter": 10000,
  "newtons per square millimeter": 1000000,
  psi: 6894.757293168362,
  psf: 47.880258980336,
};

const SPEED_TO_METERS_PER_SECOND = {
  "centimeters per minute": 0.000166666667,
  "centimeters per second": 0.01,
  "feet per hour": 8.4666836e-5,
  "feet per minute": 0.00508,
  "feet per second": 0.3048,
  "inches per minute": 0.00042333418,
  "inches per second": 0.0254,
  "kilometers per hour": 0.277777777778,
  "kilometers per second": 1000,
  knots: 0.514444444444,
  "Mach (ISA sea level)": 340.2933,
  "speed of sound": 343,
  "meters per hour": 0.000277777778,
  "meters per minute": 0.016666666667,
  "meters per second": 1,
  "miles per hour": 0.44704,
  "miles per minute": 26.8224,
  "miles per second": 1609.344,
  "yards per hour": 0.000254000508,
  "yards per minute": 0.01524,
  "yards per second": 0.9144,
  "speed of light": 299792458,
};

const TIME_TO_SECONDS = {
  picoseconds: 1e-12,
  femtoseconds: 1e-15,
  nanoseconds: 1e-9,
  microseconds: 1e-6,
  milliseconds: 0.001,
  seconds: 1,
  minutes: 60,
  hours: 3600,
  days: 86400,
  weeks: 604800,
  fortnights: 1209600,
  months: 2628000,
  quarters: 7884000,
  "synodic months": 2551442.8896,
  years: 31556952,
  decades: 315569520,
  centuries: 3155695200,
  millennia: 31556952000,
};

const VOLUME_TO_LITERS = {
  "acre foot": 1233481.83754752,
  "barrel (oil)": 158.987294928,
  "bushel (UK)": 36.36872,
  "bushel (US)": 35.23907016688,
  bushel: 35.23907016688,
  centiliter: 0.01,
  "cubic centimeter": 0.001,
  "cubic decimeter": 1,
  "cubic foot": 28.316846592,
  "cubic inch": 0.016387064,
  "cubic kilometer": 1000000000000,
  "cubic meter": 1000,
  "cubic mile": 4168181825000,
  "cubic millimeter": 1e-6,
  "cubic yard": 764.554857984,
  cup: 0.2365882365,
  deciliter: 0.1,
  "fluid ounce (imperial)": 0.0284130625,
  "fluid ounce (US)": 0.029573529562,
  "fluid ounce": 0.029573529562,
  "gallon (imperial)": 4.54609,
  "gallon (US)": 3.785411784,
  gallon: 3.785411784,
  kiloliter: 1000,
  liter: 1,
  milliliter: 0.001,
  microliter: 1e-6,
  nanoliter: 1e-9,
  picoliter: 1e-12,
  "pint (imperial)": 0.56826125,
  "pint (US)": 0.473176473,
  pint: 0.473176473,
  "quart (imperial)": 1.1365225,
  "quart (US)": 0.946352946,
  quart: 0.946352946,
  tablespoon: 0.014786764781,
  teaspoon: 0.004928921594,
};

const CONVERSION_TABLES = {
  angle: { base: "degrees", table: ANGLE_TO_DEGREES },
  area: { base: "square meter", table: AREA_TO_SQUARE_METERS },
  computer_data: { base: "megabytes", table: COMPUTER_TO_MEGABYTES },
  density: { base: "kilograms per liter", table: DENSITY_TO_KILOGRAMS_PER_LITER },
  energy: { base: "joule", table: ENERGY_TO_JOULES },
  force: { base: "newtons", table: FORCE_TO_NEWTONS },
  length: { base: "meter", table: LENGTH_TO_METERS },
  mass: { base: "kilogram", table: MASS_TO_KILOGRAMS },
  power: { base: "watt", table: POWER_TO_WATTS },
  pressure: { base: "pascal", table: PRESSURE_TO_PASCALS },
  speed: { base: "meters per second", table: SPEED_TO_METERS_PER_SECOND },
  time: { base: "seconds", table: TIME_TO_SECONDS },
  volume: { base: "liter", table: VOLUME_TO_LITERS },
};

const LIST_SUPPORTED_UNITS = Object.fromEntries(
  Object.entries(CONVERSION_TABLES).map(([name, value]) => [name, Object.keys(value.table)]),
);
LIST_SUPPORTED_UNITS.temperature = ["celsius", "fahrenheit", "kelvin"];

const UNIT_TYPE_NAMES = Object.keys(LIST_SUPPORTED_UNITS);

const TOOL_DEFINITIONS = [
  "temperature",
  "angle",
  "length",
  "energy",
  "force",
  "pressure",
  "power",
  "speed",
  "area",
  "mass",
  "volume",
  "computer_data",
  "density",
  "time",
].map((conversionType) => ({
  name: `convert_${conversionType}`,
  description: `Convert ${conversionType.replace("_", " ")} between units.`,
  inputSchema: {
    type: "object",
    properties: {
      value: { type: "number", description: "Numeric value to convert." },
      from_unit: { type: "string", description: "Source unit." },
      to_unit: { type: "string", description: "Target unit." },
    },
    required: ["value", "from_unit", "to_unit"],
  },
}));

TOOL_DEFINITIONS.push(
  {
    name: "convert_batch",
    description: "Perform multiple unit conversions in one request.",
    inputSchema: {
      type: "object",
      properties: {
        requests: {
          type: "array",
          items: { type: "object", additionalProperties: true },
        },
      },
      required: ["requests"],
    },
  },
  {
    name: "list_supported_units",
    description: "List all supported units or units for one conversion type.",
    inputSchema: {
      type: "object",
      properties: {
        unit_type: {
          type: "string",
          description: "Optional conversion type such as length, mass, or temperature.",
        },
      },
      additionalProperties: false,
    },
  },
);

function writeMessage(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function jsonRpcResult(id, result) {
  return { jsonrpc: "2.0", id, result };
}

function jsonRpcError(id, code, message) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

function ensureNumber(value) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error("value must be a number");
  }
  return parsed;
}

function normalizeOddUnicode(unit) {
  return String(unit)
    .replace(/â€‘/g, "-")
    .replace(/Ã—/g, "x")
    .replace(/Â/g, "")
    .trim();
}

function convertLinear(table, value, fromUnit, toUnit) {
  const normalizedFrom = normalizeOddUnicode(fromUnit);
  const normalizedTo = normalizeOddUnicode(toUnit);
  if (!(normalizedFrom in table)) {
    throw new Error(`Unsupported from_unit: ${fromUnit}`);
  }
  if (!(normalizedTo in table)) {
    throw new Error(`Unsupported to_unit: ${toUnit}`);
  }
  const baseValue = value * table[normalizedFrom];
  return baseValue / table[normalizedTo];
}

function convertTemperature(value, fromUnit, toUnit) {
  const from = normalizeOddUnicode(fromUnit);
  const to = normalizeOddUnicode(toUnit);
  const toCelsius = {
    fahrenheit: (input) => (input - 32) * 5 / 9,
    kelvin: (input) => {
      if (input < 0) {
        throw new Error("Kelvin value must be positive");
      }
      return input - 273.15;
    },
    celsius: (input) => input,
  };
  const fromCelsius = {
    fahrenheit: (input) => input * 9 / 5 + 32,
    kelvin: (input) => input + 273.15,
    celsius: (input) => input,
  };
  if (!(from in toCelsius)) {
    throw new Error(`Unsupported from_unit: ${fromUnit}`);
  }
  if (!(to in fromCelsius)) {
    throw new Error(`Unsupported to_unit: ${toUnit}`);
  }
  return fromCelsius[to](toCelsius[from](value));
}

function performConversion(conversionType, value, fromUnit, toUnit) {
  if (conversionType === "temperature") {
    return convertTemperature(value, fromUnit, toUnit);
  }

  const config = CONVERSION_TABLES[conversionType];
  if (!config) {
    throw new Error(`Unsupported conversion type: ${conversionType}`);
  }

  return convertLinear(config.table, value, fromUnit, toUnit);
}

function makeConversionPayload(conversionType, value, fromUnit, toUnit) {
  return {
    original_value: value,
    original_unit: fromUnit,
    converted_value: performConversion(conversionType, value, fromUnit, toUnit),
    converted_unit: toUnit,
    conversion_type: conversionType,
  };
}

function convertBatch(requests) {
  if (!Array.isArray(requests)) {
    throw new Error("requests must be a list");
  }

  const results = requests.map((request, index) => {
    const requestId = request?.request_id ?? `error_${index}`;
    try {
      if (request?.value === undefined || request?.value === null) {
        throw new Error("Missing required field: value");
      }
      if (!request?.from_unit) {
        throw new Error("Missing required field: from_unit");
      }
      if (!request?.to_unit) {
        throw new Error("Missing required field: to_unit");
      }
      if (!request?.conversion_type) {
        throw new Error("Missing required field: conversion_type");
      }

      const payload = makeConversionPayload(
        String(request.conversion_type),
        ensureNumber(request.value),
        String(request.from_unit),
        String(request.to_unit),
      );
      return {
        request_id: request?.request_id ?? `${request.conversion_type}_${index}`,
        success: true,
        ...payload,
      };
    } catch (error) {
      return {
        request_id: requestId,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  });

  return {
    batch_results: results,
    summary: {
      total_requests: requests.length,
      successful_conversions: results.filter((item) => item.success).length,
      failed_conversions: results.filter((item) => !item.success).length,
    },
  };
}

function listSupportedUnits(unitType) {
  if (unitType === undefined || unitType === null) {
    return LIST_SUPPORTED_UNITS;
  }
  if (!UNIT_TYPE_NAMES.includes(unitType)) {
    throw new Error(`Unsupported unit_type: ${unitType}`);
  }
  return { [unitType]: LIST_SUPPORTED_UNITS[unitType] };
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

function initializationResult() {
  return {
    protocolVersion: "2024-11-05",
    capabilities: { tools: {} },
    serverInfo: {
      name: "unit-converter-mcp",
      version: "1.0.0",
    },
  };
}

async function handleRequest(message) {
  const id = message.id ?? null;
  const method = message.method;

  if (method === "initialize") {
    return jsonRpcResult(id, initializationResult());
  }
  if (method === "notifications/initialized") {
    return null;
  }
  if (method === "tools/list") {
    return jsonRpcResult(id, { tools: TOOL_DEFINITIONS });
  }
  if (method !== "tools/call") {
    return jsonRpcError(id, -32601, `Method not found: ${method}`);
  }

  const name = message.params?.name;
  const args = message.params?.arguments ?? {};

  if (name === "convert_batch") {
    return jsonRpcResult(id, makeTextResult(convertBatch(args.requests)));
  }
  if (name === "list_supported_units") {
    return jsonRpcResult(id, makeTextResult(listSupportedUnits(args.unit_type)));
  }
  if (typeof name === "string" && name.startsWith("convert_")) {
    const conversionType = name.replace(/^convert_/, "");
    return jsonRpcResult(
      id,
      makeTextResult(
        makeConversionPayload(
          conversionType,
          ensureNumber(args.value),
          String(args.from_unit),
          String(args.to_unit),
        ),
      ),
    );
  }

  return jsonRpcError(id, -32601, `Unknown tool: ${name}`);
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
