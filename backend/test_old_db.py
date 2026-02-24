
import sqlalchemy
from sqlalchemy import create_engine, text

OLD_URL = "postgresql://neondb_owner:npg_7Ih1RrOwVeqP@ep-billowing-snow-ah347xey-pooler.c-3.us-east-1.aws.neon.tech/Snippetstream?sslmode=require&channel_binding=require"

def test_old():
    try:
        engine = create_engine(OLD_URL)
        with engine.connect() as conn:
            print("Successfully connected to OLD_URL!")
            res = conn.execute(text("SELECT count(*) FROM users"))
            print(f"Users in OLD DB: {res.fetchone()[0]}")
    except Exception as e:
        print(f"Failed to connect to OLD_URL: {e}")

if __name__ == "__main__":
    test_old()
