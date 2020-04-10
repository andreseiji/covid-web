import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import api from 'services/api';

import './PacientList.scss';

const PacientList = ({ history }) => {
  const [loading, setLoading] = useState(true);
  const [pacients, setPacients] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPacients = async () => {
      try {
        setLoading(true);
        const res = await api.post('/pacient/list', { page_index: 0, page_size: 0, order_by: 'ALPHABETICAL' });
        console.log(res);
        setPacients(res);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (err && err.message && err.message === 'Network Error') {
          setError(err.message);
        } else if (err && err.response && err.response.error) {
          setError(err.response.error);
        } else {
          setError('Erro ao obter lista de pacientes');
        }
        setLoading(false);
      }
    };
    fetchPacients();
  }, []);

  return (
    <div id="pacient-list">
      {loading ? <div>Carregando...</div> : error ? <div>{error}</div> : <div>Pacientes</div>}
    </div>
  );
};

export default withRouter(PacientList);
