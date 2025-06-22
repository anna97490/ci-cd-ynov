/**
 * Enregistre un nouvel utilisateur en envoyant les données du formulaire à l'API.
 *
 * @async
 * @function registerUser
 * @param {Object} formData - Les données du formulaire d'inscription.
 * @param {string} formData.nom - Le nom de l'utilisateur.
 * @param {string} formData.prenom - Le prénom de l'utilisateur.
 * @param {string} formData.email - L'adresse email de l'utilisateur.
 * @param {string} formData.password - Le mot de passe choisi.
 * @param {string} formData.dateNaissance - La date de naissance.
 * @param {string} formData.ville - La ville de résidence.
 * @param {string} formData.codePostal - Le code postal de la ville.
 * @returns {Promise<Object>} Les données de la réponse en cas de succès.
 * @throws {Error} Si une erreur survient (réseau, requête ou API).
 */
export const registerUser = async (formData) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const errorMessage = errorBody?.detail || "Erreur lors de l'inscription";
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Erreur réseau');
  }
};
