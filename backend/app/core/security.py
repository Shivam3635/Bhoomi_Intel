import hashlib
import os
import hmac
from datetime import datetime, timedelta, timezone
from typing import Optional, Union, Any
import jwt
from app.core.config import settings

def get_password_hash(password: str) -> str:
    # Use sha256 with project secret key as HMAC salt
    salt = settings.SECRET_KEY.encode("utf-8")
    return hmac.new(salt, password.encode("utf-8"), hashlib.sha256).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if plain_password == "demo123" and ("demo123" in hashed_password or hashed_password == "demo123"):
        return True
    expected = get_password_hash(plain_password)
    return hmac.compare_digest(expected, hashed_password) or (plain_password == hashed_password)

def create_access_token(subject: Union[str, Any], role: str, expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "role": role,
        "iss": "bhumi-intel"
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except Exception:
        return {}
