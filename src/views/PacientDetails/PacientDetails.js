import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { withRouter } from 'react-router-dom';

import * as moment from 'moment';

import api from 'services/api';

import Header from 'components/Header/Header';
import Loading from 'components/Loading/Loading';

import './PacientDetails.scss';

const PacientDetails = ({ history }) => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [pacient, setPacient] = useState({
    address: {},
    reports: []
  });
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
      <div id="pacient-details" className="container">
        <div className="card">
          <div className="title-action">
            <h3 className="title is-3">Detalhes do Paciente</h3>
            <span style={{ flex: 1 }} />
            <button type="submit" className="button is-secondary" onClick={() => { history.push(`/pacient/${id}/edit`); }}>
              Adicionar laudo
            </button>
            <button type="submit" className="button is-secondary" onClick={() => { history.push(`/pacient/${id}/edit`); }}>
              Editar paciente
            </button>
          </div>
          <hr />
          {error ? (
            <div className="notification is-danger">
              <button type="button" className="delete" onClick={() => setError(null)} />
              {error}
            </div>
          ) : (
            <div className="pacient-details">
              <h4 className="title is-4">Dados básicos</h4>
              <div className="columns">
                <div className="column">
                  <label>CPF</label>
                  <p>{pacient.cpf}</p>
                </div>
                <div className="column">
                  <label>Nome do paciente</label>
                  <p>{pacient.name}</p>
                </div>
                <div className="column">
                  <label>Nome da mãe</label>
                  <p>{pacient.mother_name}</p>
                </div>
              </div>
              <div className="columns">
                <div className="column is-one-third">
                  <label>Telefone</label>
                  <p>{pacient.phone_number}</p>
                </div>
                <div className="column is-one-third">
                  <label>Data de Nascimento</label>
                  <p>{moment(pacient.birth_date, 'YYYY-MM-DD').format('DD/MM/YYYY')}</p>
                </div>
              </div>
              <div className="columns">
                <div className="column is-one-third">
                  <label>Sexo</label>
                  <p>{pacient.sex === 'M' ? 'Masculino' : 'Feminino'}</p>
                </div>
                <div className="column is-one-third">
                  <label>Orientação Sexual</label>
                  <p>{pacient.sex_orientation || 'Não informado'}</p>
                </div>
              </div>
              <h4 className="title is-4">Endereço</h4>
              <div className="columns">
                <div className="column">
                  <label>Rua</label>
                  <p>{pacient.address.street}</p>
                </div>
                <div className="column">
                  <label>Número</label>
                  <p>{pacient.address.number}</p>
                </div>
                <div className="column">
                  <label>Complemento</label>
                  <p>{pacient.address.complement || 'Não informado'}</p>
                </div>
                <div className="column">
                  <label>Bairro</label>
                  <p>{pacient.address.neighborhood}</p>
                </div>
                <div className="column">
                  <label>Unidade de Referência</label>
                  <p>{pacient.address.reference_unit}</p>
                </div>
              </div>
              <h4 className="title is-4">Laudos</h4>
              {pacient.reports.map((data) => (
                <div key={data.report.report_ID} className="report">
                  <div className="columns">
                    <div className="column">
                      <label>Origem dos dados</label>
                      <p>{data.report.data_origin}</p>
                    </div>
                    <div className="column">
                      <label>Data de notificação</label>
                      <p>{moment(data.report.notification_date, 'YYYY-MM-DD').format('DD/MM/YYYY')}</p>
                    </div>
                    <div className="column">
                      <label>Data de início dos sintomas</label>
                      <p>{moment(data.report.symptoms_start_date, 'YYYY-MM-DD').format('DD/MM/YYYY')}</p>
                    </div>
                  </div>
                  <div className="columns">
                    <div className="column is-one-third">
                      <label>Exame Covid</label>
                      <p>{data.report.covid_exam ? 'Sim' : 'Não'}</p>
                    </div>
                    <div className="column is-one-third">
                      <label>Resultado do exame</label>
                      <p>{data.report.covid_result || 'Não informado'}</p>
                    </div>
                  </div>
                  <div className="columns">
                    <div className="column">
                      <label>Situação</label>
                      {data.report.situation.split(',').map((item) => (
                        <span className="list-item">{item}</span>
                      ))}
                    </div>
                  </div>
                  <div className="columns">
                    <div className="column">
                      <label>Comorbidade</label>
                      {data.report.comorbidity.split(',').map((item) => (
                        <span className="list-item">{item}</span>
                      ))}
                    </div>
                  </div>
                  <div className="columns">
                    <div className="column">
                      <label>Sintomas</label>
                      {data.report.symptoms.map((item) => (
                        <span className="list-item">{item.name}</span>
                      ))}
                    </div>
                  </div>
                  <hr />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default withRouter(PacientDetails);
