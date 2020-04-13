import React from 'react';
import { withRouter } from 'react-router-dom';

import './NotFound.scss';

const NotFound = ({ history }) => (
  <div id="not-found">
    <h1 className="title is-1">404</h1>
    <div className="page-not-found">Página não encontrada</div>
    <button type="submit" className="button is-success" onClick={() => history.push('/')}>
      Voltar à página inicial
    </button>
  </div>
);

export default withRouter(NotFound);
