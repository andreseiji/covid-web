import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { withRouter } from 'react-router-dom';

import api from 'services/api';

import Header from 'components/Header/Header';

import './PacientDetails.scss';

const PacientDetails = ({ history }) => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [pacient, setPacient] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPacient = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/pacient/list/${id}`);
        console.log(res);
        setPacient(res);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (err && err.message && err.message === 'Network Error') {
          setError(err.message);
        } else if (err && err.response && err.response.error) {
          setError(err.response.error);
        } else {
          setError('Erro ao obter paciente');
        }
        setLoading(false);
      }
    };
    fetchPacient();
  }, [id]);

  return (
    <>
      <Header />
      <div id="pacient-details">
        {loading ? <div>Carregando...</div> : error ? <div>{error}</div> : <div>Detalhes Paciente</div>}
      </div>
    </>
  );
};

export default withRouter(PacientDetails);
