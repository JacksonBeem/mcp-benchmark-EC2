from __future__ import annotations

import os
import sys
from pathlib import Path


def main() -> None:
    servers_root = Path(__file__).resolve().parents[2]
    sys.path.insert(0, str(servers_root / "mcp-nixos"))
    os.environ.setdefault("MCP_NIXOS_TRANSPORT", "stdio")

    from mcp_nixos.server import main as nixos_main  # type: ignore[import-not-found]

    nixos_main()


if __name__ == "__main__":
    main()

