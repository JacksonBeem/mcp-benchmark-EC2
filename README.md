# EC2 Tiered MCP Runtime

This repo has been repurposed from the old custom high-workload prototype into a tiered EC2 MCP host that mirrors the `light`, `medium`, and `heavy` server sets defined in [`mcp-benchmark/sam/poc/template.yaml`](../../mcp-benchmark/sam/poc/template.yaml) and [`mcp-benchmark/sam/profiles/tiered.json`](../../mcp-benchmark/sam/profiles/tiered.json).

## Light Tier Servers

The runtime exposes the same 10 light-tier servers used by `mcp-benchmark`:

1. `fruityvice-mcp`
2. `math-mcp`
3. `call-for-papers-mcp`
4. `mcp-hn`
5. `hugeicons-mcp-server`
6. `movie-recommender-mcp`
7. `time-mcp`
8. `unit-converter-mcp`
9. `okx-mcp`
10. `wikipedia-mcp`

## Medium Tier Servers

The benchmark medium tier is:

1. `bibliomantic-mcp-server`
2. `car-price-mcp-main`
3. `game-trends-mcp`
4. `metmuseum-mcp`
5. `mcp-server-nationalparks`
6. `openapi-mcp-server`
7. `weather_mcp`
8. `mcp-osint-server`
9. `context7`
10. `steam-mcp`

## Heavy Tier Servers

The benchmark heavy tier is:

1. `biomcp`
2. `dexpaprika-mcp`
3. `mcp-google-map`
4. `nasa-mcp`
5. `mcp-nixos`
6. `paper-search-mcp`
7. `scientific_computation_mcp`
8. `medcalc`
9. `arxiv-mcp-server`
10. `huggingface-mcp-server`

## Repo Layout

- `ec2/light-route-config.json`
  Route definition for the benchmark light tier.
- `ec2/medium-route-config.json`
  Route definition for the benchmark medium tier.
- `ec2/heavy-route-config.json`
  Route definition for the benchmark heavy tier.
- `ec2/tiered-route-config.json`
  Combined light/medium/heavy route definition for one EC2 host serving all 30 benchmark servers.
- `ec2/install-light.sh`
  Clones and prepares the 10 benchmark light-tier servers on an EC2 host.
- `ec2/install-medium.sh`
  Clones and prepares the 10 benchmark medium-tier servers.
- `ec2/install-heavy.sh`
  Clones and prepares the 10 benchmark heavy-tier servers.
- `ec2/install-tiered.sh`
  Runs the light, medium, and heavy install flows together.
- `ec2/adapters/`
  Stores the benchmark-specific `stdio-adapter.mjs` files that do not exist in many upstream server repos. The install scripts now re-copy these after clone so a clean EC2 host gets the benchmark adapters automatically.
- `ec2/bootstrap-light-host.sh`
  Installs system dependencies, builds the local runtime, and starts the service with PM2.
- `ec2/bootstrap-medium-host.sh`
  Boots a medium-only EC2 runtime on port `3000`.
- `ec2/bootstrap-heavy-host.sh`
  Boots a heavy-only EC2 runtime on port `3000`.
- `ec2/bootstrap-tiered-host.sh`
  Boots one EC2 runtime that exposes `/light`, `/medium`, and `/heavy` together on port `3000`.
- `ec2/ecosystem.config.cjs`
  PM2 app definition for the light runtime.
- `ec2/ecosystem.medium.config.cjs`
  PM2 app definition for the medium runtime.
- `ec2/ecosystem.heavy.config.cjs`
  PM2 app definition for the heavy runtime.
- `ec2/ecosystem.tiered.config.cjs`
  PM2 app definition for the combined 30-server tiered runtime.
- `ec2/runtime/`
  Node/Fastify MCP runtime that bridges streamable HTTP requests to the hosted stdio MCP servers.
- `ec2_instances/server_high.py`
  Legacy heavy-workload prototype retained for reference only. It is no longer the primary runtime for this repo.

## Runtime Endpoints

- `http://127.0.0.1:3000/light/mcp`
  Light-tier MCP endpoint.
- `http://127.0.0.1:3000/light/health`
  Health check that reports the configured light-tier servers.
- `http://127.0.0.1:3000/medium/mcp`
  Medium-tier MCP endpoint once the runtime is started with `ec2/medium-route-config.json`.
- `http://127.0.0.1:3000/medium/health`
  Health check for the medium-tier route config.
- `http://127.0.0.1:3000/heavy/mcp`
  Heavy-tier MCP endpoint once the runtime is started with `ec2/heavy-route-config.json`.
- `http://127.0.0.1:3000/heavy/health`
  Health check for the heavy-tier route config.

## EC2 Setup

Run one of these on the instance after cloning the repo:

```bash
bash ec2/bootstrap-light-host.sh
```

```bash
bash ec2/bootstrap-medium-host.sh
```

```bash
bash ec2/bootstrap-heavy-host.sh
```

```bash
bash ec2/bootstrap-tiered-host.sh
```

The tiered bootstrap is the one to use if you want all 30 benchmark servers on one EC2 box with route-based access under `/light`, `/medium`, and `/heavy`.

Each bootstrap:

1. Installs Node.js, Git, and Python if needed.
2. Clones the MCP server repositories needed for that tier into `./servers`.
3. Builds the local runtime in `ec2/runtime`.
4. Starts the runtime with PM2.

The tiered bootstrap uses `ec2/tiered-route-config.json`, so one process can answer:

- `/light/mcp`
- `/medium/mcp`
- `/heavy/mcp`

## Docker

`Docker/Dockerfile` now builds the light-tier runtime instead of the old Python workload server. It expects a populated `servers/` directory in the build context.

Example build from `c:\VScode`:

```bash
docker build -f Co-Work/mcp-benchmark-high/Docker/Dockerfile -t mcp-benchmark-light .
```

## Notes

- The tier lists here intentionally mirror `mcp-benchmark`; that benchmark repo remains the source of truth for tier membership.
- `context7` is the one medium-tier repo that needs a pnpm-based monorepo build; `ec2/install-medium.sh` handles that by running `pnpm run build:mcp`.
- The old heavy benchmark response samples under `high_responses/` were left untouched because they may still be useful as historical data.
