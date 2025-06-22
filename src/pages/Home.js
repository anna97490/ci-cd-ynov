import { Link, Outlet } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-wrapper">
      <h1>Bienvenue</h1>
      <nav>
        <Link to="/">S’inscrire</Link>
        <Link to="/login">Se connecter</Link>
      </nav>

      <main>
        <Outlet /> 
      </main>
    </div>
  );
};

export default Home;
