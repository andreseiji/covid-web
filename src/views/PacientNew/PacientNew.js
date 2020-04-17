import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

import * as moment from 'moment';

import api from 'services/api';

import InputMask from 'react-input-mask';

import Header from 'components/Header/Header';
import Loading from 'components/Loading/Loading';

import './PacientNew.scss';

const PacientNew = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorFields, setErrorFields] = useState([]);

  const referenceUnits = [
    'Alto dos Ipês',
    'Centenário',
    'Centro de Saúde II',
    'Centro Oeste – “Dr Osvaldo Rangel Cardoso”',
    'Chácara Alvorada “Maria Nazaré Silva”',
    'Chaparral',
    'Eucaliptos',
    'Fantinato I',
    'Fantinato II',
    'Guaçu Mirim “Neuza Thoman  Caveanha”',
    'Guaçuano',
    'Hermínio Bueno',
    'Ipê II',
    'Ipê Pinheiro',
    'Martinho Prado  “Dr José Aristodemo Pinotti”',
    'Rosa Cruz',
    'Santa Cecília',
    'Santa Terezinha  “Dr José Lanzi”',
    'Suécia',
    'Zaniboni I',
    'Zaniboni II',
    'Zona Norte “Pref. Orlando Chiarelli”',
    'Zona Sul “Valdomiro Girard Jacob”',
  ];

  const dataOrigin = [
    'Hospital Municipal Tabajara Ramos',
    'São Francisco',
    'Santa Casa',
    'UPA',
    'Alto dos Ipês',
    'Centenário',
    'Centro de Saúde II',
    'Centro Oeste – “Dr Osvaldo Rangel Cardoso”',
    'Chácara Alvorada “Maria Nazaré Silva”',
    'Chaparral',
    'Eucaliptos',
    'Fantinato I',
    'Fantinato II',
    'Guaçu Mirim “Neuza Thoman  Caveanha”',
    'Guaçuano',
    'Hermínio Bueno',
    'Ipê II',
    'Ipê Pinheiro',
    'Martinho Prado  “Dr José Aristodemo Pinotti”',
    'Rosa Cruz',
    'Santa Cecília',
    'Santa Terezinha  “Dr José Lanzi”',
    'Suécia',
    'Zaniboni I',
    'Zaniboni II',
    'Zona Norte “Pref. Orlando Chiarelli”',
    'Zona Sul “Valdomiro Girard Jacob”',
  ];

  const symptons = [
    'Dispneia',
    'Dor de Garganta',
    'Expectoração',
    'Fadiga',
    'Febre',
    'Mialgia',
    'Outros (TODO: digitado)',
    'Rinorreia',
    'Tosse',
  ];

  const comorbidities = [
    'Diabetes',
    'DM',
    'Doença Cardio',
    'Doenças Pulmonares',
    'Hipertenso',
    'Outros (digitado)',
  ];

  const situations = [
    'Agravamento',
    'Ecaminhado para Hospital (TODO: data)',
    'Estável',
    'Intenado',
    'Óbito',
  ];

  const [cpf, setCPF] = useState(null);
  const [pacientName, setPacientName] = useState(null);
  const [mother_name, setMotherName] = useState(null);
  const [sex, setSex] = useState('');
  const [sex_orientation, setSexOrientation] = useState(null);
  const [phone_number, setPhoneNumber] = useState(null);
  const [birth_date, setBirthdate] = useState(null);
  const [address, setAddress] = useState({
    street: null,
    number: null,
    neighborhood: null,
    // complement: null,
    reference_unit: ''
  });
  const [report, setReport] = useState({
    data_origin: '',
    comorbidity: null,
    symptoms: [],
    covid_exam: false,
    covid_result: '',
    situation: '',
    notification_date: null,
    symptoms_start_date: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setErrorFields([]);
    if (
      !cpf
      || !pacientName
      || !sex
      || !phone_number
      || !birth_date
      || !address.street
      || !address.number
      || !address.neighborhood
      || !address.reference_unit
      || !report.data_origin
      || !report.symptoms
      || (report.covid_exam && !report.covid_result)
      || !report.notification_date
      || !report.symptoms_start_date
    ) {
      const errors = [];
      if (!cpf) errors.push('cpf');
      // TODO: all error fields
      setErrorFields(errors);
      setError('Preencha todos os campos obrigatórios');
      window.scrollTo(0, 0);
    } else {
      // TODO: other validations
      try {
        setLoading(true);
        await api.post('/create/pacient', {
          pacient: {
            cpf,
            name: pacientName,
            mother_name: mother_name || null,
            sex,
            sex_orientation: sex_orientation || null,
            phone_number,
            birth_date,
            address,
            report
          }
        });
        history.push(`/pacient/${cpf}`);
      } catch (err) {
        if (err && err.message && err.message === 'Network Error') {
          setError('Erro de conexão');
        } else if (err && err.response && err.response.status
            && (err.response.status === 401 || err.response.status === 403)) {
          history.push('/');
        } else {
          setError('Erro ao criar paciente');
        }
        setLoading(false);
      }
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
                <label className="label">CPF*</label>
                <div className="control">
                  <InputMask mask="999.999.999-99" className={`input ${errorFields.includes('cpf') ? 'is-danger' : null}`} type="text" onChange={(e) => setCPF(e.target.value)} disabled={loading} />
                </div>
              </div>
              <div className="field column">
                <label className="label">Nome do paciente*</label>
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
                <label className="label">Telefone*</label>
                <div className="control">
                  <InputMask mask="(99) 999999999" className="input" type="text" onChange={(e) => setPhoneNumber(e.target.value)} disabled={loading} />
                </div>
              </div>
              <div className="field column is-one-third">
                <label className="label">Data de nascimento*</label>
                <div className="control">
                  <InputMask mask="99/99/9999" className="input" type="text" onChange={(e) => setBirthdate(moment(e.target.value, 'DD/MM/YYYY').format('YYYY-MM-DD'))} disabled={loading} />
                </div>
              </div>
            </div>
            <div className="columns">
              <div className="field column" style={{ flexGrow: 0 }}>
                <label className="label">Sexo*</label>
                <div className="control">
                  <div className="select">
                    <select value={sex} onChange={(e) => setSex(e.target.value)} disabled={loading}>
                      <option value="" disabled>Selecione...</option>
                      <option value="F">Feminino</option>
                      <option value="M">Masculino</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="field column is-one-third">
                <label className="label">Orientação sexual</label>
                <div className="control">
                  <input className="input" type="text" onChange={(e) => setSexOrientation(e.target.value)} disabled={loading} />
                </div>
              </div>
            </div>
            <hr />
            <h4 className="title is-4">Endereço</h4>
            <div className="columns">
              <div className="field column">
                <label className="label">Rua*</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    onChange={
                      (e) => {
                        const { value } = e.target;
                        setAddress((addr) => ({
                          ...addr,
                          street: value
                        }));
                      }
                    }
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="field column">
                <label className="label">Número*</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    onChange={
                      (e) => {
                        const { value } = e.target;
                        setAddress((addr) => ({
                          ...addr,
                          number: value
                        }));
                      }
                    }
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="field column">
                <label className="label">Complemento</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    onChange={
                      (e) => {
                        const { value } = e.target;
                        setAddress((addr) => ({
                          ...addr,
                          complement: value
                        }));
                      }
                    }
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="field column">
                <label className="label">Bairro*</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    onChange={
                      (e) => {
                        const { value } = e.target;
                        setAddress((addr) => ({
                          ...addr,
                          neighborhood: value
                        }));
                      }
                    }
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
            <div className="columns">
              <div className="field column">
                <label className="label">Unidade de referência*</label>
                <div className="control">
                  <div className="select">
                    <select
                      value={address.reference_unit}
                      onChange={
                        (e) => {
                          const { value } = e.target;
                          setAddress((addr) => ({
                            ...addr,
                            reference_unit: value
                          }));
                        }
                      }
                      disabled={loading}
                    >
                      <option value="" disabled>Selecione...</option>
                      {referenceUnits.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <h4 className="title is-4">Relato</h4>
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
              <div className="field column">
                <label className="label">Data de notificação*</label>
                <div className="control">
                  <InputMask
                    mask="99/99/9999"
                    className="input"
                    type="text"
                    onChange={
                      (e) => {
                        const { value } = e.target;
                        setReport((rep) => ({
                          ...rep,
                          notification_date: moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD')
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
                    onChange={
                      (e) => {
                        const { value } = e.target;
                        setReport((rep) => ({
                          ...rep,
                          symptoms_start_date: moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD')
                        }));
                      }
                    }
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
            <div className="columns">
              <div className="field column is-2">
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
                      disabled={loading}
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
            {/* // TODO: multiple selection */}
            <div className="columns">
              <div className="field column">
                <label className="label">Situação</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    onChange={
                      (e) => {
                        const { value } = e.target;
                        setReport((rep) => ({
                          ...rep,
                          situation: value
                        }));
                      }
                    }
                    disabled={loading}
                  />
                </div>
                <p className="help">Separe com vírgulas</p>
              </div>
            </div>
            <div className="columns">
              <div className="field column">
                <label className="label">Comorbidade</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    onChange={
                      (e) => {
                        const { value } = e.target;
                        setReport((rep) => ({
                          ...rep,
                          comorbidity: value
                        }));
                      }
                    }
                    disabled={loading}
                  />
                </div>
                <p className="help">Separe com vírgulas</p>
              </div>
            </div>
            <div className="columns">
              <div className="field column">
                <label className="label">Sintomas*</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    onChange={
                      (e) => {
                        const { value } = e.target;
                        setReport((rep) => ({
                          ...rep,
                          symptoms: value
                        }));
                      }
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
