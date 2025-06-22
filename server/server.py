import mysql.connector
from fastapi import FastAPI, HTTPException, Depends, Body
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import List, Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
load_dotenv()


# Configuration JWT
SECRET_KEY = "secret_jwt_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


# BDD config
MYSQL_HOST = os.getenv("MYSQL_HOST", "db")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "ynov_ci")
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_ROOT_PASSWORD", "pwd")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Sécurité
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login") 

# Modèles
class User(BaseModel):
    id: Optional[int]= None
    nom: str
    prenom: str
    email: str
    password: Optional[str] = None
    dateNaissance: str
    ville: Optional[str]= None
    codePostal: Optional[str]= None
    role: Optional[str]= None 


# Fonction utilitaire pour se connecter à la BDD
def get_connection():
    return mysql.connector.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DATABASE
    )


class UserInDB(User):
    hashed_password: str


class Token(BaseModel):
    access_token: str
    user: dict


class LoginInput(BaseModel):
    email: str
    password: str


def get_password_hash(password):
    return pwd_context.hash(password)

# --- Utilitaires ---
def get_connection():
    return mysql.connector.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DATABASE
    )


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_user_by_email(email: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, nom, prenom, email, dateNaissance, ville, codePostal, role, password
        FROM user WHERE email=%s
    """, (email,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return UserInDB(id=row[0], nom=row[1], prenom=row[2], email=row[3],
                        dateNaissance=str(row[4]), ville=row[5],
                        codePostal=row[6], role=row[7], hashed_password=row[8])
    return None


def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Token invalide")
        user = get_user_by_email(email)
        if user is None:
            raise HTTPException(status_code=401, detail="Utilisateur non trouvé")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide")


# --- Routes ---
@app.post("/register", response_model=User)
def register_user(user: User):
    conn = get_connection()
    cursor = conn.cursor()

    # Vérifier doublon email
    cursor.execute("SELECT * FROM user WHERE email=%s", (user.email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    # Hasher le mot de passe
    hashed_password = get_password_hash(user.password)

    cursor.execute("""
        INSERT INTO user (nom, prenom, password, email, dateNaissance, ville, codePostal, role)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        user.nom,
        user.prenom,
        hashed_password, 
        user.email,
        user.dateNaissance,
        user.ville,
        user.codePostal,
        user.role
    ))

    conn.commit()
    conn.close()
    return user


@app.post("/login", response_model=Token)
def login_user(credentials: LoginInput):
    conn = get_connection()
    cursor = conn.cursor()

    # Rechercher l'utilisateur
    cursor.execute("""
        SELECT id, password, role
        FROM user
        WHERE email = %s
    """, (credentials.email,))
    result = cursor.fetchone()
    conn.close()

    if not result:
        raise HTTPException(status_code=400, detail="Email ou mot de passe invalide")

    user_id, hashed_password, role = result

    # Vérifier le mot de passe hashé
    if not verify_password(credentials.password, hashed_password):
        raise HTTPException(status_code=400, detail="Email ou mot de passe invalide")

    # Créer le token JWT
    payload = {
        "sub": credentials.email,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        "id": user_id
    }

    access_token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return {
        "access_token": access_token,
        "user": {
            "id": user_id,
            "role": role
        }
    }



@app.get("/users", response_model=List[User])
def get_users(current_user: UserInDB = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, nom, prenom, email, dateNaissance, ville, codePostal, role
        FROM user
    """)
    results = cursor.fetchall()
    conn.close()
    return [User(id=r[0], nom=r[1], prenom=r[2], email=r[3],
                 dateNaissance=str(r[4]), ville=r[5],
                 codePostal=r[6], role=r[7]) for r in results]


@app.get("/users/{user_id}", response_model=User)
def get_user(user_id: int, current_user: UserInDB = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Accès réservé à l'administrateur")
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, nom, prenom, email, dateNaissance, ville, codePostal, role
        FROM user WHERE id = %s
    """, (user_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return User(id=row[0], nom=row[1], prenom=row[2], email=row[3],
                    dateNaissance=str(row[4]), ville=row[5],
                    codePostal=row[6], role=row[7])
    raise HTTPException(status_code=404, detail="Utilisateur non trouvé")


@app.delete("/users/{user_id}")
def delete_user(user_id: int, current_user: UserInDB = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Suppression réservée à l'admin")
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM user WHERE id = %s", (user_id,))
    conn.commit()
    conn.close()
    return {"message": "Utilisateur supprimé."}
