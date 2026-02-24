
import sqlalchemy
from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql://neondb_owner:npg_iD7omXG0fJaF@ep-blue-lake-ahmzeeh9-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

def scan_schema():
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        for table in ['users', 'content_generations', 'usage_stats']:
            print(f"\n--- Columns in {table} ---")
            res = conn.execute(text(f"SELECT column_name FROM information_schema.columns WHERE table_name='{table}'"))
            cols = [row[0] for row in res]
            print(sorted(cols))

if __name__ == "__main__":
    scan_schema()
