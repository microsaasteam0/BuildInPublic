
import os
import sqlalchemy
from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql://neondb_owner:npg_iD7omXG0fJaF@ep-blue-lake-ahmzeeh9-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

def check_users():
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as connection:
            result = connection.execute(text("SELECT count(*) FROM users"))
            count = result.fetchone()[0]
            print(f"Total users in DB: {count}")
            
            result = connection.execute(text("SELECT id, email, username FROM users ORDER BY id DESC LIMIT 5"))
            users = result.fetchall()
            print("Recent users:")
            for user in users:
                print(f"ID: {user[0]}, Email: {user[1]}, Username: {user[2]}")
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_users()
