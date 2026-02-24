
import os
import sys
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from database import SessionLocal, engine
from auth import create_user
from models import User

def test_reg():
    db = SessionLocal()
    email = "test_user_new@example.com"
    username = "new_user_123"
    password = "password123"
    
    print(f"Attempting to register: {email}")
    try:
        # Check if already exists
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print("User already exists, deleting to retry...")
            db.delete(existing)
            db.commit()
            
        user = create_user(db, email, username, password, "Test New User")
        print(f"Successfully registered user: {user.id}")
        
        # Verify it's in the DB
        db.refresh(user)
        check = db.query(User).filter(User.id == user.id).first()
        if check:
            print(f"Verification successful: User {check.email} is in DB")
        else:
            print("Verification FAILED: User not found after save!")
            
    except Exception as e:
        print(f"Error during registration flow: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_reg()
