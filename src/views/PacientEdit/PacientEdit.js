import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { withRouter } from 'react-router-dom';

import * as moment from 'moment';

import api from 'services/api';

import Header from 'components/Header/Header';
import Loading from 'components/Loading/Loading';

import './PacientEdit.scss';

const PacientEdit = ({ history }) => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [pacient, setPacient] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPacient = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/pacient/${id}`);
        setPacient(res.data);
        setLoading(false);
      } catch (err) {
        if (err && err.message && err.message === 'Network Error') {
          setError(err.message);
        } else if (err && err.response && err.response.status
            && (err.response.status === 404 || err.response.status === 409)) {
          history.push('/404');
        } else if (err && err.response && err.response.error) {
          setError(err.response.error);
        } else {
          setError('Erro ao obter paciente');
        }
        setLoading(false);
      }
    };
    fetchPacient();
    // eslint-disable-next-line
  }, [id]);

  return (
    <>
      <Header />
      {loading && <Loading />}
      <div id="pacient-edit" className="container">
        <div className="card">
          <h3 className="title is-3">Detalhes do Paciente</h3>
          <hr />
          {error && (
            <div className="notification is-danger">
              <button type="button" className="delete" onClick={() => setError(null)} />
              {error}
            </div>
          )}
          {pacient.cpf}
          <button type="submit" className="button is-primary" onClick={() => { history.push(`/pacient/${id}/edit`); }}>
            Editar paciente
          </button>
        </div>
      </div>
    </>
  );
};

export default withRouter(PacientEdit);
