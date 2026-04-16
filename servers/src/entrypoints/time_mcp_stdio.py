from __future__ import annotations

import sys
from pathlib import Path


def main() -> None:
    servers_root = Path(__file__).resolve().parents[2]
    sys.path.insert(0, str(servers_root / "time-mcp" / "src"))

    from mcp_server_time import main as time_main  # type: ignore[import-not-found]

    time_main()


if __name__ == "__main__":
    main()

