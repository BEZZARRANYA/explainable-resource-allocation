import sqlite3
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
DB_PATH = PROJECT_ROOT / "data" / "resource_allocation.db"
SCHEMA_PATH = PROJECT_ROOT / "db" / "schema.sql"
SEED_PATH = PROJECT_ROOT / "db" / "seed.sql"


def main():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)

    with sqlite3.connect(DB_PATH) as conn:
        conn.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))
        conn.executescript(SEED_PATH.read_text(encoding="utf-8"))
        conn.commit()

    print(f"Database created at: {DB_PATH}")


if __name__ == "__main__":
    main()

