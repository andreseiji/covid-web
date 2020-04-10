import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

import { login } from 'services/auth';

import api from 'services/api';

import Logo from 'assets/img/logo.svg';

import './Login.scss';

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
    <div id="login" className="columns is-centered">
      <div className="card">
        <img src={Logo} alt="Covid-19" />
        <h3 className="title is-3">Casos Covid-19</h3>
        <h5 className="title is-5">Mogi-Guaçu</h5>

        {error && (
          <div className="notification is-danger">
            <button type="button" className="delete" onClick={() => setError(null)} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="field">
            <p className="control has-icons-left has-icons-right">
              <input className="input" type="text" placeholder="Nome de usuário" onChange={(e) => setUsername(e.target.value)} />
              <span className="icon is-small is-left">
                <i className="fas fa-user" />
              </span>
            </p>
          </div>
          <div className="field">
            <p className="control has-icons-left">
              <input className="input" type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} />
              <span className="icon is-small is-left">
                <i className="fas fa-lock" />
              </span>
            </p>
          </div>
          <div className="field">
            <p className="control">
              <button type="submit" className="button is-success is-fullwidth">
                Acessar
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withRouter(Login);
