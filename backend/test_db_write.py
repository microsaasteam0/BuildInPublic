
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, User
from dotenv import load_dotenv
from pathlib import Path

# Load env
env_path = Path(__file__).resolve().parent / '.env'
load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv("DATABASE_URL")

def test_insert():
    try:
        engine = create_engine(DATABASE_URL)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        # Try to find a test user or create one
        test_email = "test_connection@example.com"
        user = db.query(User).filter(User.email == test_email).first()
        
        if not user:
            print(f"Creating test user {test_email}...")
            user = User(
                email=test_email,
                username="test_user_" + str(os.getpid()),
                full_name="Test Connection User",
                is_active=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"User created with ID: {user.id}")
        else:
            print(f"User already exists with ID: {user.id}")
            # Update something to test write
            user.full_name = "Tested " + str(os.getpid())
            db.commit()
            print("User updated successfully")
            
        db.close()
        print("Write test successful!")
        
    except Exception as e:
        print(f"Write test failed: {e}")

if __name__ == "__main__":
    test_insert()
