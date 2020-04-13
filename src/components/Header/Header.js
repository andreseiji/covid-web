import React, { useState } from 'react';
import { withRouter, Link, NavLink } from 'react-router-dom';

import { logout } from 'services/auth';

import Logo from 'assets/img/logo.svg';

import './Header.scss';

const Header = ({ history }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = () => {
    logout();
    history.replace('/');
  };

  return (
    <div className="header-container">
      <div id="header">
        <Link className="logo" to="/">
          <img src={Logo} alt="Covid-19" />
          <span>
            Casos
            <br />
            Covid-19
          </span>
        </Link>
        <NavLink className="link-item" activeClassName="is-active" to="/" exact>Pacientes</NavLink>
        <NavLink className="link-item" activeClassName="is-active" to="/new-pacient">Novo paciente</NavLink>
        <span style={{ flex: 1 }} />
        <button
          type="button"
          className="button"
          onClick={() => setModalVisible(true)}
        >
          Sair
        </button>
      </div>
      <div className={`modal ${modalVisible ? 'is-active' : null}`}>
        <div className="modal-background" onClick={() => setModalVisible(false)} />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Sair da aplicação</p>
            <button type="button" className="delete" aria-label="close" onClick={() => setModalVisible(false)} />
          </header>
          <section className="modal-card-body">
            Tem certeza que deseja sair?
          </section>
          <footer className="modal-card-foot" style={{ justifyContent: 'flex-end' }}>
            <button type="button" className="button" onClick={() => setModalVisible(false)}>Cancelar</button>
            <button type="button" className="button is-danger" onClick={() => handleLogout()}>Sair</button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Header);
