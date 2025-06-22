/**
 * Récupère les détails d'un utilisateur par son ID.
 *
 * @async
 * @function fetchUserById
 * @param {string|number} id - L'identifiant unique de l'utilisateur à récupérer.
 * @returns {Promise<Object>} Les données de l'utilisateur récupéré.
 * @throws {Error} Si le token est invalide/expiré ou si l'utilisateur est introuvable.
 */
export const fetchUserById = async (id) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });


  /**
   * Supprime un utilisateur par son ID.
   *
   * @async
   * @function deleteUserById
   * @param {string|number} id - L'identifiant unique de l'utilisateur à supprimer.
   * @returns {Promise<Object>} La réponse JSON après la suppression.
   * @throws {Error} Si le token est invalide/expiré ou si une erreur se produit lors de la suppression.
   */
  if (response.status === 401 || response.status === 403) {
    throw new Error("Accès refusé : token invalide ou expiré.");
  }

  if (!response.ok) throw new Error("Utilisateur introuvable");
  return await response.json();
};


/**
 * Supprime un utilisateur par son ID.
 *
 * @async
 * @function deleteUserById
 * @param {string|number} id - L'identifiant unique de l'utilisateur à supprimer.
 * @returns {Promise<Object>} La réponse JSON après la suppression.
 * @throws {Error} Si le token est invalide/expiré ou si une erreur se produit lors de la suppression.
 */
export const deleteUserById = async (id) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error("Accès refusé : token invalide ou expiré.");
  }

  if (!response.ok) throw new Error("Erreur lors de la suppression");
  return await response.json();
};
