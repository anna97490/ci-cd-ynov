import mysql.connector
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import os

app = FastAPI()

# Charger les variables d’environnement
MYSQL_HOST = os.getenv("MYSQL_HOST", "db")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "ynov_ci")
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_ROOT_PASSWORD", "pwd")

# Modèle utilisateur
class User(BaseModel):
    nom: str
    prenom: str
    email: str
    dateNaissance: str
    ville: str
    codePostal: str

# Fonction utilitaire pour se connecter à la BDD
def get_connection():
    return mysql.connector.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DATABASE
    )

# Routes
@app.get("/")
def read_root():
    return {"message": "Bienvenue dans l'API FastAPI"}

@app.get("/users", response_model=List[User])
def get_users():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT nom, prenom, email, dateNaissance, ville, codePostal FROM users")
    results = cursor.fetchall()
    conn.close()
    return [User(**{
        "nom": row[0],
        "prenom": row[1],
        "email": row[2],
        "dateNaissance": row[3].isoformat(),
        "ville": row[4],
        "codePostal": row[5]
    }) for row in results]

@app.post("/users", response_model=User)
def create_user(user: User):
    conn = get_connection()
    cursor = conn.cursor()
    # Vérifier doublon email
    cursor.execute("SELECT * FROM users WHERE email=%s", (user.email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    # Insérer utilisateur
    cursor.execute("""
        INSERT INTO users (nom, prenom, email, dateNaissance, ville, codePostal)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (user.nom, user.prenom, user.email, user.dateNaissance, user.ville, user.codePostal))
    conn.commit()
    conn.close()
    return user
