import React from 'react';
import { withRouter, Link } from 'react-router-dom';

import { logout } from 'services/auth';

import Logo from 'assets/img/logo.svg';

import './Header.scss';

const Header = ({ history }) => (
  <div id="header">
    <Link className="logo" to="/">
      <img src={Logo} alt="Covid-19" />
      <span>
        Casos
        <br />
        Covid-19
      </span>
    </Link>
    <Link className="link-item" to="/">Pacientes</Link>
    <Link className="link-item" to="/new-pacient">Novo paciente</Link>
    <span style={{ flex: 1 }} />
    <button
      type="button"
      className="button"
      onClick={() => {
        logout();
        history.replace('/');
      }}
    >
      Sair
    </button>
  </div>
);

export default withRouter(Header);
