import React, { useState, useEffect } from 'react';
import './Registration.css';
import { isValidEmail, isValidName, isValidPostalCode, isOver18 } from '../../utils/validation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Registration = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    dateNaissance: "",
    ville: "",
    codePostal: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [existingUsers, setExistingUsers] = useState([]);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setExistingUsers(storedUsers);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate({ ...formData, [name]: value }));
  };

  const validate = (data = formData) => {
    const newErrors = {};
    const usersInStorage = JSON.parse(localStorage.getItem('users')) || [];
  
    if (!data.nom) newErrors.nom = "Le nom est requis.";
    else if (!isValidName(data.nom)) newErrors.nom = "Le nom ne doit pas contenir de chiffres ou caractères spéciaux.";
  
    if (!data.prenom) newErrors.prenom = "Le prénom est requis.";
    else if (!isValidName(data.prenom)) newErrors.prenom = "Le prénom ne doit pas contenir de chiffres ou caractères spéciaux.";
  
    if (!data.email) newErrors.email = "L'email est requis.";
    else if (!isValidEmail(data.email)) newErrors.email = "L'adresse email n'est pas valide.";
    else if (usersInStorage.some(user => user.email === data.email)) newErrors.email = "Cet email est déjà utilisé.";
  
    if (!data.dateNaissance) newErrors.dateNaissance = "La date de naissance est requise.";
    else if (!isOver18(data.dateNaissance)) newErrors.dateNaissance = "Vous devez avoir au moins 18 ans.";
  
    if (!data.ville) newErrors.ville = "La ville est requise.";
    else if (!isValidName(data.ville)) newErrors.ville = "Le nom de la ville ne doit pas contenir de chiffres ou caractères spéciaux.";
  
    if (!data.codePostal) newErrors.codePostal = "Le code postal est requis.";
    else if (!isValidPostalCode(data.codePostal)) newErrors.codePostal = "Le code postal doit comporter 5 chiffres.";
  
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length === 0) {
      const updatedUsers = [...existingUsers, formData];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setExistingUsers(updatedUsers);
      onRegister(formData);
      toast.success("Inscription réussie !");
      setFormData({ nom: "", prenom: "", email: "", dateNaissance: "", ville: "", codePostal: "" });
      setErrors({});
      setTouched({});
    } else {
      setErrors(newErrors);
      toast.error("Veuillez corriger les erreurs dans le formulaire.");
    }
  };

  const isFormValid = Object.keys(validate()).length === 0;

  return (
    <>
      <form onSubmit={handleSubmit} data-testid="registration-form">
        {["nom", "prenom", "email", "dateNaissance", "ville", "codePostal"].map((field) => (
          <div key={field} style={{ marginBottom: '10px' }}>
            <input
              name={field}
              type={field === "dateNaissance" ? "date" : "text"}
              placeholder={field}
              value={formData[field]}
              onChange={handleChange}
              onBlur={() => setTouched((prev) => ({ ...prev, [field]: true }))}
              style={{
                borderColor: errors[field] && touched[field] ? "red" : undefined,
                borderWidth: errors[field] && touched[field] ? "2px" : "1px",
              }}
            />
            {errors[field] && touched[field] && (
              <p style={{ color: "red", fontSize: "0.9em" }}>{errors[field]}</p>
            )}
          </div>
        ))}
        <button type="submit" disabled={!isFormValid}>
          Sauvegarder
        </button>
      </form>
      <ToastContainer />
    </>
  );
};

export default Registration;
