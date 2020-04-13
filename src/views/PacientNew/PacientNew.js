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
            <h4 className="title is-4">Dados básicos</h4>
            <div className="columns">
              <div className="field column">
                <label className="label">CPF</label>
                <div className="control">
                  <input className="input" type="text" placeholder="XXX.XXX.XXX-XX" onChange={(e) => setCPF(e.target.value)} disabled={loading} />
                </div>
              </div>
              <div className="field column">
                <label className="label">Nome do paciente</label>
                <div className="control">
                  <input className="input" type="text" onChange={(e) => setPacientName(e.target.value)} disabled={loading} />
                </div>
              </div>
              <div className="field column">
                <label className="label">Nome da mãe</label>
                <div className="control">
                  <input className="input" type="text" onChange={(e) => setMotherName(e.target.value)} disabled={loading} />
                </div>
              </div>
            </div>
            <div className="columns">
              <div className="field column is-one-third">
                <label className="label">Telefone</label>
                <div className="control">
                  <input className="input" type="text" onChange={(e) => setPhoneNumber(e.target.value)} disabled={loading} />
                </div>
              </div>
              <div className="field column is-one-third">
                <label className="label">Data de nascimento</label>
                <div className="control">
                  <input className="input" type="text" onChange={(e) => setBirthdate(e.target.value)} disabled={loading} />
                </div>
              </div>
            </div>
            <div className="columns">
              <div className="field column is-one-third">
                <label className="label">Orientação sexual</label>
                <div className="control">
                  <input className="input" type="text" onChange={(e) => setSexOrientation(e.target.value)} disabled={loading} />
                </div>
              </div>
              <div className="field column">
                <label className="label">Sexo</label>
                <div className="control">
                  <div className="select">
                    <select onChange={(e) => setSex(e.target.value)} disabled={loading}>
                      <option disabled>Selecione...</option>
                      <option value="F">Feminino</option>
                      <option value="M">Masculino</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <h4 className="title is-4">Endereço</h4>
            <div className="columns">
              <div className="field column">
                <label className="label">Rua</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    onChange={
                      (e) => setAddress((addr) => ({
                        ...addr,
                        street: e.target.value
                      }))
                    }
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="field column">
                <label className="label">Número</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    onChange={
                      (e) => setAddress((addr) => ({
                        ...addr,
                        number: e.target.value
                      }))
                    }
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="field column">
                <label className="label">Bairro</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    onChange={
                      (e) => setAddress((addr) => ({
                        ...addr,
                        neighborhood: e.target.value
                      }))
                    }
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="field column">
                <label className="label">Unidade de referência</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    onChange={
                      (e) => setAddress((addr) => ({
                        ...addr,
                        reference_unit: e.target.value
                      }))
                    }
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
            <hr />
            <h4 className="title is-4">Relato</h4>
            <div className="columns">
              <div className="field column">
                <label className="label">Origem do dado</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    onChange={
                      (e) => setReport((rep) => ({
                        ...rep,
                        data_origin: e.target.value
                      }))
                    }
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="field column">
                <label className="label">Comorbidade</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    onChange={
                      (e) => setReport((rep) => ({
                        ...rep,
                        comorbidity: e.target.value
                      }))
                    }
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
            <div className="columns">
              <div className="field column is-2">
                <label className="label">Exame Covid</label>
                <div className="control">
                  <div className="select">
                    <select
                      onChange={
                        (e) => setReport((rep) => ({
                          ...rep,
                          covid_exam: e.target.value
                        }))
                      }
                    >
                      <option disabled>Selecione...</option>
                      <option value>Sim</option>
                      <option value={false}>Não</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="field column">
                <label className="label">Resultado do exame</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    onChange={
                      (e) => setReport((rep) => ({
                        ...rep,
                        covid_result: e.target.value
                      }))
                    }
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="field column">
                <label className="label">Situação</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    onChange={
                      (e) => setReport((rep) => ({
                        ...rep,
                        situation: e.target.value
                      }))
                    }
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="field column">
                <label className="label">Data de notificação</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    onChange={
                      (e) => setReport((rep) => ({
                        ...rep,
                        notification_date: e.target.value
                      }))
                    }
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
            <div className="columns">
              <div className="field column">
                <label className="label">Sintomas</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    onChange={
                      (e) => setReport((rep) => ({
                        ...rep,
                        symptoms: e.target.value
                      }))
                    }
                    disabled={loading}
                  />
                </div>
                <p className="help">Separe com vírgulas</p>
              </div>
            </div>
            <hr />
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
