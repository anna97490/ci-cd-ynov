/**
 * Effectue une requête POST vers l’API pour authentifier un utilisateur.
 *
 * @async
 * @function loginUser
 * @param {Object} credentials - Les identifiants de l'utilisateur.
 * @param {string} credentials.email - L'adresse email de l'utilisateur.
 * @param {string} credentials.password - Le mot de passe de l'utilisateur.
 * @returns {Promise<{ token: string, user: Object }>} Un objet contenant le token JWT et les informations utilisateur.
 * @throws {Error} Si la requête échoue, ou si la réponse ne contient pas de token.
 */
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const errorMessage = errorBody?.detail || "Erreur d'authentification";
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!data.access_token) {
      throw new Error("Token manquant dans la réponse");
    }

    return {
      token: data.access_token,
      user: data.user
    };
  } catch (error) {
    throw new Error(error.message || 'Erreur réseau');
  }
};
