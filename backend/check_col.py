
import sqlalchemy
from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql://neondb_owner:npg_iD7omXG0fJaF@ep-blue-lake-ahmzeeh9-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

def check_col():
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        res = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='users' AND column_name='verification_token'"))
        row = res.fetchone()
        if row:
            print("verification_token EXISTS")
        else:
            print("verification_token MISSING")

if __name__ == "__main__":
    check_col()
