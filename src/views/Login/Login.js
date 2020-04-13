import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

import { login } from 'services/auth';

import api from 'services/api';

import Loading from 'components/Loading/Loading';

import Logo from 'assets/img/logo.svg';

import './Login.scss';

const Login = ({ history }) => {
  const [loading, setLoading] = useState(false);
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
        setLoading(true);
        const res = await api.post('/authenticate', { user: { username, password } });
        await login(res.data.accessToken);
        history.replace('/');
      } catch (err) {
        if (err && err.message && err.message === 'Network Error') {
          setError('Erro de conexão');
        } else if (err && err.response && err.response.data && err.response.data.statusCode
            && (err.response.data.statusCode === 401 || err.response.data.statusCode === 404)) {
          setError('Credenciais inválidas');
        } else {
          setError('Erro ao acessar');
        }
        setLoading(false);
      }
    }
  };

  return (
    <div id="login" className="columns is-centered">
      {loading && <Loading />}
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
            <p className="control has-icons-left">
              <input className="input" type="text" placeholder="Nome de usuário" onChange={(e) => setUsername(e.target.value)} disabled={loading} />
              <span className="icon is-small is-left">
                <i className="fas fa-user" />
              </span>
            </p>
          </div>
          <div className="field">
            <p className="control has-icons-left">
              <input className="input" type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} disabled={loading} />
              <span className="icon is-small is-left">
                <i className="fas fa-lock" />
              </span>
            </p>
          </div>
          <div className="field">
            <p className="control">
              <button type="submit" className="button is-success is-fullwidth" disabled={loading}>
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
