import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { withRouter } from 'react-router-dom';

import * as moment from 'moment';

import { dataOrigin, symptoms, comorbidities, situations } from 'data/enums';

import InputMask from 'react-input-mask';

import api from 'services/api';

import Header from 'components/Header/Header';
import Loading from 'components/Loading/Loading';

import './PacientDetails.scss';

// eslint-disable-next-line
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    // eslint-disable-next-line
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const PacientDetails = ({ history }) => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [pacient, setPacient] = useState({
    address: {},
    reports: []
  });
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorModal, setErrorModal] = useState(null);
  const [report, setReport] = useState({
    data_origin: '',
    comorbidity: '',
    symptoms: [],
    covid_exam: false,
    covid_result: '',
    situation: '',
    notification_date: '',
    symptoms_start_date: ''
  });
  const [currentSituations, setCurrentSituations] = useState([]);
  const [currentComorbidities, setCurrentComorbidities] = useState([]);
  const [currentSymptoms, setCurrentSymptons] = useState([]);
  const [enableOtherComorbidity, setEnableOtherComorbidity] = useState(false);
  const [enableOtherSymptom, setEnableOtherSymptom] = useState(false);
  const [other_comorbidities, setOtherComorbidities] = useState('');
  const [other_symptoms, setOtherSymptoms] = useState('');

  const handleSituation = (value) => {
    if (!currentSituations.includes(value)) {
      const newArr = [...currentSituations];
      newArr.push(value);
      setCurrentSituations(newArr);
    } else {
      const newArr = currentSituations.filter((v) => v !== value);
      setCurrentSituations(newArr);
    }
  };

  const handleComorbidity = (value) => {
    if (!currentComorbidities.includes(value)) {
      const newArr = [...currentComorbidities];
      newArr.push(value);
      setCurrentComorbidities(newArr);
      if (value === 'Outros') setEnableOtherComorbidity(true);
    } else {
      const newArr = currentComorbidities.filter((v) => v !== value);
      setCurrentComorbidities(newArr);
      if (value === 'Outros') setEnableOtherComorbidity(false);
    }
  };

  const handleSymptom = (value) => {
    if (!currentSymptoms.includes(value)) {
      const newArr = [...currentSymptoms];
      newArr.push(value);
      setCurrentSymptons(newArr);
      if (value === 'Outros') setEnableOtherSymptom(true);
    } else {
      const newArr = currentSymptoms.filter((v) => v !== value);
      setCurrentSymptons(newArr);
      if (value === 'Outros') setEnableOtherSymptom(false);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorModal(null);
    if (
      !report.data_origin
      || !currentSymptoms || (currentSymptoms && !currentSymptoms.length)
      || (report.covid_exam && !report.covid_result)
      || !report.notification_date
      || !report.symptoms_start_date
    ) {
      setErrorModal('Preencha todos os campos obrigatórios');
    } else if (
      !moment(report.notification_date, 'DD/MM/YYYY').isValid()
      || !moment(report.symptoms_start_date, 'DD/MM/YYYY').isValid()
    ) {
      setError('Uma ou mais datas não são válidas');
      window.scrollTo(0, 0);
    } else {
      const payload = {
        cpf: id,
        report: {
          ...report,
          comorbidity: currentComorbidities.join(),
          symptoms: currentSymptoms.map((s) => ({ name: s })),
          situation: currentSituations.join(),
          notification_date: moment(report.notification_date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
          symptoms_start_date: moment(report.symptoms_start_date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
          other_comorbidities: enableOtherComorbidity && other_comorbidities ? other_comorbidities : null,
          other_symptoms: enableOtherSymptom && other_symptoms ? other_symptoms : null,
        }
      };
      try {
        setLoading(true);
        await api.post('/create/report', payload);
        setLoading(false);
        setModalVisible(false);
        fetchPacient();
      } catch (err) {
        if (err && err.message && err.message === 'Network Error') {
          setErrorModal('Erro de conexão');
        } else if (err && err.response && err.response.status
            && (err.response.status === 401 || err.response.status === 403)) {
          history.push('/');
        } else {
          setErrorModal('Erro ao criar laudo');
        }
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchPacient();
    // eslint-disable-next-line
  }, [id]);

  return (
    <>
      <div className={`modal ${modalVisible ? 'is-active' : null}`}>
        <div className="modal-background" onClick={() => setModalVisible(false)} />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Novo Laudo</p>
            <button type="button" className="delete" aria-label="close" onClick={() => setModalVisible(false)} />
          </header>
          <section className="modal-card-body">
            <div className="field">
              {errorModal && (
                <div className="notification is-danger">
                  <button type="button" className="delete" onClick={() => setErrorModal(null)} />
                  {errorModal}
                </div>
              )}
            </div>
            <form>
              <div className="columns">
                <div className="field column">
                  <label className="label">Origem dos dados*</label>
                  <div className="control">
                    <div className="select">
                      <select
                        value={report.data_origin}
                        onChange={
                          (e) => {
                            const { value } = e.target;
                            setReport((rep) => ({
                              ...rep,
                              data_origin: value
                            }));
                          }
                        }
                        disabled={loading}
                      >
                        <option value="" disabled>Selecione...</option>
                        {dataOrigin.map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="columns">
                <div className="field column">
                  <label className="label">Data de notificação*</label>
                  <div className="control">
                    <InputMask
                      mask="99/99/9999"
                      className="input"
                      type="text"
                      value={report.notification_date}
                      onChange={
                        (e) => {
                          const { value } = e.target;
                          setReport((rep) => ({
                            ...rep,
                            notification_date: value
                          }));
                        }
                      }
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="field column">
                  <label className="label">Data de início dos sintomas*</label>
                  <div className="control">
                    <InputMask
                      mask="99/99/9999"
                      className="input"
                      type="text"
                      value={report.symptoms_start_date}
                      onChange={
                        (e) => {
                          const { value } = e.target;
                          setReport((rep) => ({
                            ...rep,
                            symptoms_start_date: value
                          }));
                        }
                      }
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
              <div className="columns">
                <div className="field column is-3">
                  <label className="label">Exame Covid*</label>
                  <div className="control">
                    <div className="select">
                      <select
                        value={report.covid_exam}
                        onChange={
                          (e) => {
                            const { value } = e.target;
                            setReport((rep) => ({
                              ...rep,
                              covid_exam: value
                            }));
                          }
                        }
                        disabled={loading}
                      >
                        <option value="" disabled>Selecione...</option>
                        <option value>Sim</option>
                        <option value={false}>Não</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="field column">
                  <label className="label">Resultado do exame</label>
                  <div className="control">
                    <div className="select">
                      <select
                        value={report.covid_result}
                        onChange={
                          (e) => {
                            const { value } = e.target;
                            setReport((rep) => ({
                              ...rep,
                              covid_result: value
                            }));
                          }
                        }
                        disabled={loading || !report.covid_exam}
                      >
                        <option value="" disabled>Selecione...</option>
                        <option value="Positivo">Positivo</option>
                        <option value="Negativo">Negativo</option>
                        <option value="Aguardando">Aguardando</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="columns">
                <div className="field column">
                  <label className="label">Situação</label>
                  <div className="choice-group">
                    {situations.map((situation) => (
                      <button key={situation} type="button" className={`choice ${currentSituations.includes(situation) ? 'active' : null}`} onClick={() => handleSituation(situation)}>{situation}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="columns">
                <div className="field column">
                  <label className="label">Comorbidade</label>
                  <div className="choice-group">
                    {comorbidities.map((comorbidity) => (
                      <button key={comorbidity} type="button" className={`choice ${currentComorbidities.includes(comorbidity) ? 'active' : null}`} onClick={() => handleComorbidity(comorbidity)}>{comorbidity}</button>
                    ))}
                  </div>
                  {enableOtherComorbidity && (
                    <div className="field column">
                      <label className="label">Outras comorbidades</label>
                      <div className="control">
                        <input className="input" type="text" value={other_comorbidities} onChange={(e) => setOtherComorbidities(e.target.value)} disabled={loading} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="columns">
                <div className="field column">
                  <label className="label">Sintomas*</label>
                  <div className="choice-group">
                    {symptoms.map((symptom) => (
                      <button key={symptom} type="button" className={`choice ${currentSymptoms.includes(symptom) ? 'active' : null}`} onClick={() => handleSymptom(symptom)}>{symptom}</button>
                    ))}
                  </div>
                  {enableOtherSymptom && (
                    <div className="field column">
                      <label className="label">Outros sintomas</label>
                      <div className="control">
                        <input className="input" type="text" value={other_symptoms} onChange={(e) => setOtherSymptoms(e.target.value)} disabled={loading} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
            <div className="field">
              {errorModal && (
                <div className="notification is-danger">
                  <button type="button" className="delete" onClick={() => setErrorModal(null)} />
                  {errorModal}
                </div>
              )}
            </div>
          </section>
          <footer className="modal-card-foot" style={{ justifyContent: 'flex-end' }}>
            <button type="button" className="button" onClick={() => setModalVisible(false)}>Cancelar</button>
            <button type="submit" className="button is-success" disabled={loading} onClick={handleSubmit}>
              Adicionar laudo
            </button>
          </footer>
        </div>
      </div>
      <Header />
      {loading && <Loading />}
      <div id="pacient-details" className="container">
        <div className="card">
          <div className="title-action">
            <h3 className="title is-3">Detalhes do Paciente</h3>
            <span style={{ flex: 1 }} />
            <button type="submit" className="button is-secondary" onClick={() => setModalVisible(true)}>
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
                  <p>{pacient.mother_name || 'Não informado'}</p>
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
                  <p>{pacient.sex_orientation === 'null' || !pacient.sex_orientation ? 'Não informado' : pacient.sex_orientation}</p>
                </div>
              </div>
              <h4 className="title is-4">Endereço</h4>
              <div className="columns">
                <div className="column">
                  <label>Unidade de Referência</label>
                  <p>{pacient.address.reference_unit || 'Não informado'}</p>
                </div>
              </div>
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
                  <p>{pacient.address.complement === 'null' || !pacient.address.complement ? 'Não informado' : pacient.address.complement}</p>
                </div>
                <div className="column">
                  <label>Bairro</label>
                  <p>{pacient.address.neighborhood}</p>
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
                      {!data.report.situation && (
                        <p>Não informado</p>
                      )}
                      {data.report.situation.split(',').map((item) => (
                        <span key={uuidv4()} className="list-item">{item}</span>
                      ))}
                    </div>
                  </div>
                  <div className="columns">
                    <div className="column">
                      <label>Comorbidade</label>
                      {!data.report.comorbidity && (
                        <p>Não informado</p>
                      )}
                      {data.report.comorbidity.split(',').map((item) => (
                        <span key={uuidv4()} className="list-item">{item}</span>
                      ))}
                      {data.report.other_comorbidities ? <span className="list-item">{data.report.other_comorbidities}</span> : null}
                    </div>
                  </div>
                  <div className="columns">
                    <div className="column">
                      <label>Sintomas</label>
                      {data.report.symptoms.map((item) => (
                        <span key={uuidv4()} className="list-item">{item.name}</span>
                      ))}
                      {data.report.other_symptoms ? <span className="list-item">{data.report.other_symptoms}</span> : null}
                    </div>
                  </div>
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
