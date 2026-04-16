const path = require("path");

const repoRoot = path.join(__dirname, "..");

module.exports = {
  apps: [
    {
      name: "light-runtime",
      cwd: repoRoot,
      script: "ec2/runtime/dist/ec2-mcp-server.js",
      interpreter: "node",
      env: {
        PORT: "3000",
        MCP_ROUTE_CONFIGS_FILE: "ec2/light-route-config.json",
      },
    },
  ],
};
