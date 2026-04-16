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

clone_repo "biomcp" "https://github.com/genomoncology/biomcp"
clone_repo "dexpaprika-mcp" "https://github.com/coinpaprika/dexpaprika-mcp"
clone_repo "mcp-google-map" "https://github.com/cablate/mcp-google-map"
clone_repo "nasa-mcp" "https://github.com/AnCode666/nasa-mcp"
clone_repo "mcp-nixos" "https://github.com/utensils/mcp-nixos"
clone_repo "paper-search-mcp" "https://github.com/openags/paper-search-mcp"
clone_repo "scientific_computation_mcp" "https://github.com/Aman-Amith-Shastry/scientific_computation_mcp"
clone_repo "medcalc" "https://github.com/vitaldb/medcalc"
clone_repo "arxiv-mcp-server" "https://github.com/blazickjp/arxiv-mcp-server"
clone_repo "huggingface-mcp-server" "https://github.com/shreyaskarnik/huggingface-mcp-server"

build_npm_repo "dexpaprika-mcp"
build_npm_repo "mcp-google-map"

echo "INFO: heavy-tier server install complete"
