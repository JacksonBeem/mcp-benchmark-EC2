#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

bash "${SCRIPT_DIR}/install-light.sh"
bash "${SCRIPT_DIR}/install-medium.sh"
bash "${SCRIPT_DIR}/install-heavy.sh"

echo "INFO: tiered server install complete"
