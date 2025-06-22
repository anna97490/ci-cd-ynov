/**
 * Récupère la liste de tous les utilisateurs via l'API sécurisée.
 *
 * @async
 * @function fetchUsers
 * @returns {Promise<Object[]>} Un tableau d'utilisateurs récupérés depuis l'API.
 * @throws {Error} Si la requête échoue ou si le token est invalide/absent.
 */
export const fetchUsers = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Échec de récupération des utilisateurs");
  }

  return await response.json();
};


/**
 * Récupère un utilisateur spécifique via son ID.
 *
 * @async
 * @function fetchUserById
 * @param {string|number} id - L'identifiant de l'utilisateur à récupérer.
 * @returns {Promise<Object>} Les données de l'utilisateur correspondant à l'ID fourni.
 * @throws {Error} Si le token est manquant ou si la requête échoue.
 */
export const fetchUserById = async (id) => {
  const token = localStorage.getItem("token");

  if (!token) throw new Error("Token manquant");

  const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Utilisateur introuvable");
  }

  return await response.json();
};
