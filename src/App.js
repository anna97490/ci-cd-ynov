import './App.css';
import React, { useState } from 'react';
import Registration from "./components/registration/Registration";
import UserList from './components/userlist/UserList';

function App() {
  const [users, setUsers] = useState([]);

  const handleAddUser = (user) => {
    setUsers((prev) => [...prev, user]);
  };

  return (
    <div className="App">
        <h1>Inscription</h1>
      <Registration onRegister={handleAddUser} />
      <UserList users={users} />
    </div>
  );
}

export default App;
