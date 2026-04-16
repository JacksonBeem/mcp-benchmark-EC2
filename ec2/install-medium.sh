#!/bin/bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SERVERS_DIR="${REPO_ROOT}/servers"

mkdir -p "${SERVERS_DIR}"
cd "${SERVERS_DIR}"

clone_repo() {
  local name="$1"
  local url="$2"
  if [ -d "${name}/.git" ] || [ -d "${name}" ]; then
    echo "INFO: ${name} already present; skipping clone"
    return
  fi
  echo "INFO: cloning ${name} from ${url}"
  git clone --depth 1 "${url}" "${name}"
}

build_npm_repo() {
  local name="$1"
  if [ ! -f "${name}/package.json" ]; then
    echo "INFO: ${name} has no package.json; skipping npm install"
    return
  fi

  echo "INFO: npm install (${name})"
  (
    cd "${name}"
    npm install
    if node -e "const p=require('./package.json'); process.exit(p.scripts && p.scripts.build ? 0 : 1)"; then
      echo "INFO: npm run build (${name})"
      npm run build
    else
      echo "INFO: no build script for ${name}; using checked-in entrypoints"
    fi
  )
}

build_pnpm_repo() {
  local name="$1"
  local script_name="${2:-build}"
  if [ ! -f "${name}/package.json" ]; then
    echo "INFO: ${name} has no package.json; skipping pnpm install"
    return
  fi

  echo "INFO: pnpm install (${name})"
  (
    cd "${name}"
    npx pnpm install
    echo "INFO: pnpm run ${script_name} (${name})"
    npx pnpm run "${script_name}"
  )
}

clone_repo "bibliomantic-mcp-server" "https://github.com/d4nshields/bibliomantic-mcp-server"
clone_repo "car-price-mcp-main" "https://github.com/yusaaztrk/car-price-mcp-main"
clone_repo "game-trends-mcp" "https://github.com/halismertkir/game-trends-mcp"
clone_repo "metmuseum-mcp" "https://github.com/mikechao/metmuseum-mcp"
clone_repo "mcp-server-nationalparks" "https://github.com/KyrieTangSheng/mcp-server-nationalparks"
clone_repo "openapi-mcp-server" "https://github.com/janwilmake/openapi-mcp-server"
clone_repo "weather_mcp" "https://github.com/HarunGuclu/weather_mcp"
clone_repo "mcp-osint-server" "https://github.com/himanshusanecha/mcp-osint-server"
clone_repo "context7" "https://github.com/upstash/context7"
clone_repo "steam-mcp" "https://github.com/algorhythmic/steam-mcp"

build_pnpm_repo "metmuseum-mcp"
build_npm_repo "mcp-server-nationalparks"
build_npm_repo "openapi-mcp-server"
build_npm_repo "weather_mcp"
build_pnpm_repo "context7" "build:mcp"
build_npm_repo "steam-mcp"

echo "INFO: medium-tier server install complete"
