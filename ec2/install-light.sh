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

build_node_repo() {
  local name="$1"
  if [ ! -f "${name}/package.json" ]; then
    echo "INFO: ${name} has no package.json; skipping npm build"
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

build_repo_script() {
  local name="$1"
  local script_name="$2"
  if [ ! -f "${name}/package.json" ]; then
    echo "INFO: ${name} has no package.json; skipping custom build"
    return
  fi

  echo "INFO: npm install (${name})"
  (
    cd "${name}"
    npm install
    echo "INFO: npm run ${script_name} (${name})"
    npm run "${script_name}"
  )
}

clone_repo "fruityvice-mcp" "https://github.com/CelalKhalilov/fruityvice-mcp"
clone_repo "math-mcp" "https://github.com/EthanHenrickson/math-mcp"
clone_repo "call-for-papers-mcp" "https://github.com/iremert/call-for-papers-mcp"
clone_repo "mcp-hn" "https://github.com/erithwik/mcp-hn"
clone_repo "hugeicons-mcp-server" "https://github.com/hugeicons/mcp-server"
clone_repo "movie-recommender-mcp" "https://github.com/iremert/movie-recommender-mcp"
clone_repo "time-mcp" "https://github.com/dumyCq/time-mcp"
clone_repo "unit-converter-mcp" "https://github.com/zazencodes/unit-converter-mcp"
clone_repo "okx-mcp" "https://github.com/esshka/okx-mcp"
clone_repo "wikipedia-mcp" "https://github.com/Rudra-ravi/wikipedia-mcp"

build_repo_script "math-mcp" "build:stdio"
build_node_repo "hugeicons-mcp-server"
build_node_repo "okx-mcp"

echo "INFO: light-tier server install complete"
