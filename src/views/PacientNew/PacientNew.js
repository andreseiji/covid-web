import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

import api from 'services/api';

import Header from 'components/Header/Header';

import './PacientNew.scss';

const PacientNew = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <>
      <Header />
      <div id="pacient-new">
        <div>Criar Paciente</div>
      </div>
    </>
  );
};

export default withRouter(PacientNew);
