import React, { useState } from 'react';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!isValidName(formData.nom)) newErrors.nom = "Nom invalide";
    if (!isValidName(formData.prenom)) newErrors.prenom = "Prénom invalide";
    if (!isValidEmail(formData.email)) newErrors.email = "Email invalide";
    if (!isOver18(formData.dateNaissance)) newErrors.dateNaissance = "Âge < 18";
    if (!isValidName(formData.ville)) newErrors.ville = "Ville invalide";
    if (!isValidPostalCode(formData.codePostal)) newErrors.codePostal = "Code postal invalide";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      onRegister(formData);
      toast.success("Inscription réussie !");
      setFormData({ nom: "", prenom: "", email: "", dateNaissance: "", ville: "", codePostal: "" });
      setErrors({});
    } else {
      setErrors(newErrors);
    }
  };

  const isFormValid = () =>
    formData.nom &&
    formData.prenom &&
    formData.email &&
    formData.dateNaissance &&
    formData.ville &&
    formData.codePostal &&
    Object.keys(validate()).length === 0;

  return (
    <>
      <form onSubmit={handleSubmit}>
        {["nom", "prenom", "email", "dateNaissance", "ville", "codePostal"].map((field) => (
          <div key={field}>
            <input
              name={field}
              type={field === "dateNaissance" ? "date" : "text"}
              placeholder={field}
              value={formData[field]}
              onChange={handleChange}
            />
            {errors[field] && <p style={{ color: "red" }}>{errors[field]}</p>}
          </div>
        ))}
        <button type="submit" disabled={!isFormValid()}>
          Sauvegarder
        </button>
      </form>
      <ToastContainer />
    </>
  );
};

export default Registration;
