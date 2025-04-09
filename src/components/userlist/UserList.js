import React from "react";

const UserList = ({ users }) => {
  return (
    <div>
      <h2>Liste des inscrits</h2>
      <ul>
        {users.map((u, i) => (
          <li key={i}>
            {u.prenom} {u.nom} – {u.ville} ({u.codePostal})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
