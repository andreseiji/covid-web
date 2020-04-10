import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

import api from 'services/api';

const Login = ({ history }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Preencha todos os campos');
    } else {
      setError(null);
      try {
        await api.post('/auth', { username, password });
        history.push('/app');
      } catch (err) {
        setError(err.message);
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h1>Login</h1>

      {error && (<p>{error}</p>)}

      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Acessar</button>
      </form>
    </div>
  );
};

export default withRouter(Login);
