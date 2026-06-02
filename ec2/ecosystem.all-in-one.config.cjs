const path = require("path");

const repoRoot = path.join(__dirname, "..");

module.exports = {
  apps: [
    {
      name: "all-in-one-runtime",
      cwd: repoRoot,
      script: "ec2/runtime/dist/ec2-mcp-server.js",
      interpreter: "node",
      env: {
        PORT: "3000",
        MCP_ROUTE_CONFIGS_FILE: "ec2/all-in-one-route-config.json",
      },
    },
  ],
};
