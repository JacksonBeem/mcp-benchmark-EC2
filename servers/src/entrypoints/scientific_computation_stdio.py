from __future__ import annotations

import sys
from pathlib import Path


def main() -> None:
    servers_root = Path(__file__).resolve().parents[2]
    sys.path.insert(0, str(servers_root / "scientific_computation_mcp" / "src"))

    import main as scientific_main  # type: ignore[import-not-found]

    scientific_main.mcp.run()


if __name__ == "__main__":
    main()

