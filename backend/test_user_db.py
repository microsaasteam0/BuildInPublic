
import os
import sqlalchemy
from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql://neondb_owner:npg_iD7omXG0fJaF@ep-blue-lake-ahmzeeh9-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

def test_connection():
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print(f"Connection result: {result.fetchone()}")
            
            # Check for existing tables
            result = connection.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema='public'"))
            tables = [row[0] for row in result.fetchall()]
            print(f"Full tables list: {', '.join(tables)}")
            
    except Exception as e:
        print(f"Error details: {str(e)}")

if __name__ == "__main__":
    test_connection()
