export const isValidName = (str) => {
  const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\-\'\s]+$/;
  return regex.test(str);
};

export const isValidEmail = (email) => {
  const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email);
};

export const isValidPostalCode = (code) => {
  return /^\d{5}$/.test(code);
};

export const calculateAge = (birthDate) => {
  const today = new Date();
  const dob = new Date(birthDate);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
};

export const isOver18 = (birthDate) => {
  return calculateAge(birthDate) >= 18;
};
