from __future__ import annotations

import sys
from pathlib import Path


def main() -> None:
    servers_root = Path(__file__).resolve().parents[2]
    sys.path.insert(0, str(servers_root / "game-trends-mcp"))

    from server import mcp  # type: ignore[import-not-found]

    mcp.run(transport="stdio")


if __name__ == "__main__":
    main()

