import React, { useState } from 'react';
import './Registration.css';
import { useNavigate } from 'react-router-dom';
import {
  isValidEmail,
  isValidName,
  isValidPostalCode,
  isOver18,
  isValidPassword
} from '../../utils/validation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerUser } from './registrationService';

const Registration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    dateNaissance: "",
    ville: "",
    codePostal: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});


  /**
   * Valide les données du formulaire.
   *
   * @function
   * @param {Object} [data=formData] - Les données du formulaire à valider.
   * @returns {Object} Un objet contenant les messages d'erreur pour chaque champ non valide.
   */
  const validate = (data = formData) => {
    const newErrors = {};

    if (!data.nom) newErrors.nom = "Le nom est requis.";
    else if (!isValidName(data.nom)) newErrors.nom = "Le nom ne doit contenir que des lettres.";

    if (!data.prenom) newErrors.prenom = "Le prénom est requis.";
    else if (!isValidName(data.prenom)) newErrors.prenom = "Le prénom ne doit contenir que des lettres.";

    if (!data.email) newErrors.email = "L'email est requis.";
    else if (!isValidEmail(data.email)) newErrors.email = "L'adresse email n'est pas valide.";

    if (!data.password) newErrors.password = "Le mot de passe est requis.";
    else if (!isValidPassword(data.password)) {
      newErrors.password = "Mot de passe trop faible (6+ caractères, 1 lettre et 1 chiffre).";
    }

    if (!data.dateNaissance) newErrors.dateNaissance = "La date de naissance est requise.";
    else if (!isOver18(data.dateNaissance)) newErrors.dateNaissance = "Vous devez avoir au moins 18 ans.";

    if (!data.ville) newErrors.ville = "La ville est requise.";
    else if (!isValidName(data.ville)) newErrors.ville = "Le nom de la ville ne doit contenir que des lettres.";

    if (!data.codePostal) newErrors.codePostal = "Le code postal est requis.";
    else if (!isValidPostalCode(data.codePostal)) newErrors.codePostal = "Le code postal doit comporter 5 chiffres.";

    return newErrors;
  };


  /**
  * Gère la modification d’un champ du formulaire.
  *
  * @function
  * @param {React.ChangeEvent<HTMLInputElement>} e - Événement de changement de champ.
  */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate({ ...formData, [name]: value }));
  };


  /**
   * Gère la soumission du formulaire.
   *
   * @async
   * @function
   * @param {React.FormEvent<HTMLFormElement>} e - Événement de soumission du formulaire.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length === 0) {
      try {
        await registerUser(formData);
        toast.success("Inscription réussie ! Redirection vers la page de connexion...");
        setFormData({
          nom: "", prenom: "", email: "", password: "",
          dateNaissance: "", ville: "", codePostal: ""
        });
        setErrors({});
        setTouched({});
        setTimeout(() => navigate("/login"), 2000);
      } catch (error) {
        toast.error(error.message || "Erreur lors de l'inscription.");
      }
    } else {
      setErrors(newErrors);
      toast.error("Veuillez corriger les erreurs dans le formulaire.");
    }
  };


  // Vérifie si le formulaire est valide pour activer le bouton de soumission
  const isFormValid = Object.keys(validate()).length === 0;


  return (
    <div className="registration-wrapper">
      <form onSubmit={handleSubmit} data-testid="registration-form">
        {[
          { name: "nom", type: "text" },
          { name: "prenom", type: "text" },
          { name: "email", type: "email" },
          { name: "password", type: "password" },
          { name: "dateNaissance", type: "date" },
          { name: "ville", type: "text" },
          { name: "codePostal", type: "text" },
        ].map(({ name, type }) => (
          <div key={name}>
            <input
              name={name}
              type={type}
              placeholder={name}
              value={formData[name]}
              onChange={handleChange}
              onBlur={() => setTouched((prev) => ({ ...prev, [name]: true }))}
              style={{
                borderColor: errors[name] && touched[name] ? "red" : undefined,
                borderWidth: errors[name] && touched[name] ? "2px" : "1px",
              }}
            />
            {errors[name] && touched[name] && (
              <p className="error">{errors[name]}</p>
            )}
          </div>
        ))}

        <button type="submit" disabled={!isFormValid}>
          S'inscrire
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Registration;
