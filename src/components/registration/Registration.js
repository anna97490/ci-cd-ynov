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
  const [userCoiunt, setUserCount] = useState([]);

  // 1. Charger tous les utilisateurs au montage (GET /users)
useEffect(() => {
  const getUser = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + "/users");
      const data = await response.json();
      setUserCount(data.length);
    } catch (error) {
      console.error("Erreur lors de la récupération du nombre d'utilisateurs :", error);
    }
  };

  getUser();

  fetch(process.env.REACT_APP_API_URL + "/users")
    .then(response => response.json())
    .then(data => {
      // Tu peux mettre ici d'autres effets secondaires si nécessaire
      console.log("Utilisateurs récupérés (2e appel)", data);
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    });
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate({ ...formData, [name]: value }));
  };

  const validate = (data = formData) => {
    const newErrors = {};

    if (!data.nom) newErrors.nom = "Le nom est requis.";
    else if (!isValidName(data.nom)) newErrors.nom = "Le nom ne doit contenir que des lettres.";

    if (!data.prenom) newErrors.prenom = "Le prénom est requis.";
    else if (!isValidName(data.prenom)) newErrors.prenom = "Le prénom ne doit contenir que des lettres.";

    if (!data.email) newErrors.email = "L'email est requis.";
    else if (!isValidEmail(data.email)) newErrors.email = "L'adresse email n'est pas valide.";
    else if (existingUsers.some(user => user.email === data.email)) newErrors.email = "Cet email est déjà utilisé.";

    if (!data.dateNaissance) newErrors.dateNaissance = "La date de naissance est requise.";
    else if (!isOver18(data.dateNaissance)) newErrors.dateNaissance = "Vous devez avoir au moins 18 ans.";

    if (!data.ville) newErrors.ville = "La ville est requise.";
    else if (!isValidName(data.ville)) newErrors.ville = "Le nom de la ville ne doit contenir que des lettres.";

    if (!data.codePostal) newErrors.codePostal = "Le code postal est requis.";
    else if (!isValidPostalCode(data.codePostal)) newErrors.codePostal = "Le code postal doit comporter 5 chiffres.";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length === 0) {
      // 2. Envoyer un nouvel utilisateur en POST /users
      fetch("http://localhost:8000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors de l'inscription");
          }
          return response.json();
        })
        .then(() => {
          // Après un ajout réussi, recharger la liste des utilisateurs
          return fetch("http://localhost:8000/users");
        })
        .then(response => response.json())
        .then(data => {
          setExistingUsers(data);
          onRegister(formData);
          toast.success("Inscription réussie !");
          setFormData({ nom: "", prenom: "", email: "", dateNaissance: "", ville: "", codePostal: "" });
          setErrors({});
          setTouched({});
        })
        .catch((error) => {
          console.error(error);
          toast.error("Erreur lors de l'inscription.");
        });
    } else {
      setErrors(newErrors);
      toast.error("Veuillez corriger les erreurs dans le formulaire.");
    }
  };

  const isFormValid = Object.keys(validate()).length === 0;

  return (
    <div className="registration-wrapper">
      <form onSubmit={handleSubmit} data-testid="registration-form">
        {["nom", "prenom", "email", "dateNaissance", "ville", "codePostal"].map((field) => (
          <div key={field}>
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
              <p className="error">{errors[field]}</p>
            )}
          </div>
        ))}
        <button type="submit" disabled={!isFormValid}>
          Sauvegarder
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Registration;
