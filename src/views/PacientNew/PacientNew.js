import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

import api from 'services/api';

import Header from 'components/Header/Header';
import Loading from 'components/Loading/Loading';


import './PacientNew.scss';

const PacientNew = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [cpf, setCPF] = useState(null);
  const [pacientName, setPacientName] = useState(null);
  const [mother_name, setMotherName] = useState(null);
  const [sex, setSex] = useState(null);
  const [sex_orientation, setSexOrientation] = useState(null);
  const [phone_number, setPhoneNumber] = useState(null);
  const [birth_date, setBirthdate] = useState(null);
  const [address, setAddress] = useState({
    street: null,
    number: null,
    neighborhood: null,
    reference_unit: null
  });
  const [report, setReport] = useState({
    data_origin: null,
    comorbidity: null,
    symptoms: [],
    covid_exam: false,
    covid_result: null,
    situation: null,
    notification_date: null,
    symptoms_start_date: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const data = await api.post('/create/pacient', {
        pacient: {
          cpf,
          name: pacientName,
          mother_name,
          sex,
          sex_orientation,
          phone_number,
          birth_date,
          address,
          report
        }
      });
      console.log(data);
      alert('token válido');
      setLoading(false);
    } catch (err) {
      if (err && err.message && err.message === 'Network Error') {
        setError('Erro de conexão');
      } else if (err && err.response && err.response.status
          && (err.response.status === 401 || err.response.status === 403)) {
        alert('Credenciais inválidas');
        history.push('/');
      } else {
        setError('Erro ao criar paciente');
      }
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      {loading && <Loading />}
      <div id="pacient-new" className="container">
        <div className="card">
          <h3 className="title is-3">Criar Paciente</h3>
          <hr />
          {error && (
            <div className="notification is-danger">
              <button type="button" className="delete" onClick={() => setError(null)} />
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <p className="control button-container">
                <button type="submit" className="button is-success" disabled={loading}>
                  Criar paciente
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default withRouter(PacientNew);
