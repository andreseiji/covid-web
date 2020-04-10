import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

import { login } from 'services/auth';

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
        const token = await api.post('/auth', { username, password });
        await login(token);
        history.replace('/');
      } catch (err) {
        if (err && err.message && err.message === 'Network Error') {
          setError(err.message);
        } else if (err && err.response && err.response.error) {
          setError(err.response.error);
        } else {
          setError('Erro ao acessar');
        }
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
