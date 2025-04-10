/**
 * Vérifie si une chaîne est un nom valide
 * Accepte les lettres accents trémas tirets et espaces
 *
 * @param {string} str - Nom à valider
 * @returns {boolean} true si le nom est valide sinon false
*/
export const isValidName = (str) => {
  const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ-' \s]+$/;
  return regex.test(str);
};

/**
 * Vérifie si un email est valide
 *
 * @param {string} email - Email à valider
 * @returns {boolean} true si l'email est valide sinon false
*/
export const isValidEmail = (email) => {
  const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email);
};

/**
 * Vérifie si un code postal est au format français (5 chiffres)
 *
 * @param {string} code - Le code postal à valider
 * @returns {boolean} true si le code postal est valide sinon false
*/
export const isValidPostalCode = (code) => {
  return /^\d{5}$/.test(code);
};

/**
 * Calcule l'âge à partir d'une date de naissance
 *
 * @param {string|Date} birthDate - La date de naissance (au format ISO ou Date)
 * @returns {number} Age calculé
*/
export const calculateAge = (birthDate) => {
  const today = new Date();
  const dob = new Date(birthDate);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
};

/**
 * Vérifie si une personne a au moins 18 ans
 *
 * @param {string|Date} birthDate - La date de naissance
 * @returns {boolean} true si l'âge est supérieur ou égal à 18 ans sinon false
*/
export const isOver18 = (birthDate) => {
  return calculateAge(birthDate) >= 18;
};
