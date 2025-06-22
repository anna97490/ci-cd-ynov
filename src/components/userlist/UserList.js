import React, { useEffect, useState } from "react";
import "./UserList.css";
import { useNavigate } from "react-router-dom";
import { fetchUsers } from "./userService";
import { useAuth } from "../../context/AuthContext";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // utilisateur connecté (admin ou pas)

  
  useEffect(() => {
    fetchUsers()
      .then(data => setUsers(data || []))
      .catch(err => {
        console.error("Erreur :", err);
        alert("Erreur de chargement : " + err.message);
      });
  }, []);


  /**
  * Gère la déconnexion de l'utilisateur et redirige vers la page de login.
  *
  * @function
  */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="userlist-wrapper">
      <div className="logout-button">
        <button onClick={handleLogout}>Déconnexion</button>
      </div>
      <h2>Utilisateurs inscrits</h2>
      <div className="user-card-grid">
        {users.map((userItem) => (
          <div key={userItem.id} className="user-card">
            <h3>{userItem.prenom} {userItem.nom}</h3>
            <p>{userItem.email}</p>

            {/* Seul l'admin voit le bouton "Voir plus" */}
            {user?.role === 'admin' && (
              <button onClick={() => navigate(`/users/${userItem.id}`)}>
                Voir plus
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
