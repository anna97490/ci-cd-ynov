import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isValidEmail, isValidPassword } from '../../utils/validation';
import { loginUser } from './loginService';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /**
  * Valide les champs email et mot de passe.
  * @param {Object} [data=formData] - Données du formulaire à valider.
  * @returns {Object} Un objet contenant les messages d’erreur par champ.
  */
  const validate = (data = formData) => {
    const newErrors = {};

    if (!data.email) newErrors.email = "L'email est requis.";
    else if (!isValidEmail(data.email)) newErrors.email = "Adresse email invalide.";

    if (!data.password) newErrors.password = "Le mot de passe est requis.";
    else if (!isValidPassword(data.password)) {
      newErrors.password = "Mot de passe trop faible (6+ caractères, 1 lettre et 1 chiffre).";
    }

    return newErrors;
  };


  /**
  * Gère la mise à jour des champs du formulaire.
  * Met à jour les erreurs et les champs "touchés".
  * @param {React.ChangeEvent<HTMLInputElement>} e - Événement de changement.
  */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate({ ...formData, [name]: value }));
  };


  /**
  * Gère la soumission du formulaire.
  * Appelle l’API `loginUser`, déclenche `login()`, redirige et affiche un toast.
  * @param {React.FormEvent<HTMLFormElement>} e - Événement de soumission.
  */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length === 0) {
      try {
        const data = await loginUser(formData);
        login(data.user, data.token);
        toast.success('Connexion réussie !');
        navigate('/users');
      } catch (error) {
        toast.error(error.message || 'Identifiants incorrects ou erreur serveur');
      }
    } else {
      setErrors(newErrors);
      toast.error('Veuillez corriger les erreurs');
    }
  };

  const isFormValid = Object.keys(validate()).length === 0;

  return (
    <div className="login-wrapper">
      <form onSubmit={handleSubmit} data-testid="login-form">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            style={{
              borderColor: errors.email && touched.email ? "red" : undefined,
              borderWidth: errors.email && touched.email ? "2px" : "1px",
            }}
          />
          {errors.email && touched.email && (
            <p className="error">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
            style={{
              borderColor: errors.password && touched.password ? "red" : undefined,
              borderWidth: errors.password && touched.password ? "2px" : "1px",
            }}
          />
          {errors.password && touched.password && (
            <p className="error">{errors.password}</p>
          )}
        </div>

        <button type="submit" disabled={!isFormValid}>
          Se connecter
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
