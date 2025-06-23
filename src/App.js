import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Registration from './components/registration/Registration';
import UserList from './components/userlist/UserList';
import RequireAuth from './routes/RequiredAuth';
import Home from './pages/Home';
import Login from './components/login/Login';
import Details from './components/details/Details';

function App() {
  return (
    <Router>
       <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Registration />} />
          <Route path="login" element={<Login />} />
        </Route>

        <Route path="/users" element={
          <RequireAuth>
            <UserList />
          </RequireAuth>
        } />

        <Route path="/users/:id" element={ 
          <RequireAuth>
            <Details />
          </RequireAuth>
        } /> 
      </Routes>
    </Router>
  );
}

export default App;
