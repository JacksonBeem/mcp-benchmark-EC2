from __future__ import annotations

import sys
from pathlib import Path


def main() -> None:
    servers_root = Path(__file__).resolve().parents[2]
    sys.path.insert(0, str(servers_root / "unit-converter-mcp" / "src"))

    from unit_converter_mcp.server import main as unit_main  # type: ignore[import-not-found]

    unit_main()


if __name__ == "__main__":
    main()

