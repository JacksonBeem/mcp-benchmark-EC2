from __future__ import annotations

import sys
from pathlib import Path


def main() -> None:
    servers_root = Path(__file__).resolve().parents[2]
    sys.path.insert(0, str(servers_root / "mcp-reddit" / "src"))

    from mcp_reddit.reddit_fetcher import mcp  # type: ignore[import-not-found]

    mcp.run()


if __name__ == "__main__":
    main()

