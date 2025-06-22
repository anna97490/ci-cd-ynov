import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


/**
 * Composant de protection de route.
 * Redirige vers la page de connexion si l'utilisateur n'est pas authentifié.
 *
 * @component
 * @param {Object} props - Les propriétés du composant.
 * @param {React.ReactNode} props.children - Les composants enfants à afficher si l'utilisateur est authentifié.
 * @returns {JSX.Element} Les enfants si authentifié, sinon une redirection vers `/login`.
 */
const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default RequireAuth;
