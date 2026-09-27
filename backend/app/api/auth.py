from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, create_access_token, decode_token
from app.models.models import User, AuditLog
from app.schemas.schemas import LoginRequest, Token, UserOut
import json

router = APIRouter(prefix="/auth", tags=["Authentication & RBAC"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    if not token:
        # In demo mode, fallback to default policymaker user if no token provided
        user = db.query(User).filter(User.email == "policymaker@example.com").first()
        if user:
            return user
        raise HTTPException(status_code=401, detail="Authentication token required")
    payload = decode_token(token)
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/login", response_model=Token)
def login(creds: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == creds.email).first()
    if not user or not verify_password(creds.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password. Use demo accounts (e.g. policymaker@example.com / demo123)"
        )
    
    # Audit log login
    audit = AuditLog(
        user_email=user.email,
        action="LOGIN",
        resource_type="AUTH",
        resource_id=user.id,
        details_json=json.dumps({"role": user.role, "organization": user.organization})
    )
    db.add(audit)
    db.commit()

    access_token = create_access_token(subject=user.email, role=user.role)
    return Token(
        access_token=access_token,
        token_type="bearer",
        role=user.role,
        email=user.email,
        full_name=user.full_name,
        organization=user.organization
    )

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/users", response_model=list[UserOut])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()
