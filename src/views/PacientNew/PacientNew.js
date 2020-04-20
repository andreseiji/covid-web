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

  const symptoms = [
    'Dispneia',
    'Dor de Garganta',
    'Expectoração',
    'Fadiga',
    'Febre',
    'Mialgia',
    'Rinorreia',
    'Tosse',
    'Outros',
  ];

  const comorbidities = [
    'Diabetes',
    'Doença Cardio',
    'Doenças Pulmonares',
    'Hipertenso',
    'Outros',
  ];

  const situations = [
    'Agravamento',
    'Ecaminhado para Hospital',
    'Estável',
    'Internado',
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
    complement: null,
    reference_unit: ''
  });
  const [report, setReport] = useState({
    data_origin: '',
    comorbidity: null,
    symptoms: [],
    covid_exam: false,
    covid_result: '',
    situation: null,
    notification_date: null,
    symptoms_start_date: null
  });
  const [currentSituations, setCurrentSituations] = useState([]);
  const [currentComorbidities, setCurrentComorbidities] = useState([]);
  const [currentSymptoms, setCurrentSymptons] = useState([]);
  // const [enableOtherComorbidity, setEnableOtherComorbidity] = useState(false);
  // const [enableOtherSymptom, setEnableOtherSymptom] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
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
      setError('Preencha todos os campos obrigatórios');
      window.scrollTo(0, 0);
    } else {
      const pacient = {
        cpf,
        name: pacientName,
        mother_name: mother_name || null,
        sex,
        sex_orientation: sex_orientation || null,
        phone_number,
        birth_date: moment(birth_date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        address,
        report: {
          ...report,
          comorbidity: currentComorbidities.join(),
          symptoms: currentSymptoms.map((s) => ({ name: s })),
          situation: currentSituations.join(),
          notification_date: moment(report.notification_date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
          symptoms_start_date: moment(report.symptoms_start_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
        }
      };
      try {
        setLoading(true);
        await api.post('/create/pacient', { pacient });
        history.push(`/pacient/${cpf}`);
      } catch (err) {
        if (err && err.message && err.message === 'Network Error') {
          setError('Erro de conexão');
          window.scrollTo(0, 0);
        } else if (err && err.response && err.response.status
            && (err.response.status === 401 || err.response.status === 403)) {
          history.push('/');
        } else {
          setError('Erro ao criar paciente');
          window.scrollTo(0, 0);
        }
        setLoading(false);
      }
    }
  };

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
    } else {
      const newArr = currentComorbidities.filter((v) => v !== value);
      setCurrentComorbidities(newArr);
    }
  };

  const handleSymptom = (value) => {
    if (!currentSymptoms.includes(value)) {
      const newArr = [...currentSymptoms];
      newArr.push(value);
      setCurrentSymptons(newArr);
    } else {
      const newArr = currentSymptoms.filter((v) => v !== value);
      setCurrentSymptons(newArr);
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
                  <InputMask mask="999.999.999-99" className="input" type="text" value={cpf} onChange={(e) => setCPF(e.target.value)} disabled={loading} />
                </div>
              </div>
              <div className="field column">
                <label className="label">Nome do paciente*</label>
                <div className="control">
                  <input className="input" type="text" value={pacientName} onChange={(e) => setPacientName(e.target.value)} disabled={loading} />
                </div>
              </div>
              <div className="field column">
                <label className="label">Nome da mãe</label>
                <div className="control">
                  <input className="input" type="text" value={mother_name} onChange={(e) => setMotherName(e.target.value)} disabled={loading} />
                </div>
              </div>
            </div>
            <div className="columns">
              <div className="field column">
                <label className="label">Telefone*</label>
                <div className="control">
                  <InputMask mask="(99) 999999999" className="input" type="text" value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} disabled={loading} />
                </div>
              </div>
              <div className="field column">
                <label className="label">Data de nascimento*</label>
                <div className="control">
                  <InputMask mask="99/99/9999" className="input" type="text" value={birth_date} onChange={(e) => setBirthdate(e.target.value)} disabled={loading} />
                </div>
              </div>
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
                  <input className="input" type="text" value={sex_orientation} onChange={(e) => setSexOrientation(e.target.value)} disabled={loading} />
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
                    value={address.street}
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
                    value={address.number}
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
                    value={address.complement}
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
                    value={address.neighborhood}
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
            <div className="report">
              <h4 className="title is-4">Laudo</h4>
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
                </div>
              </div>
            </div>
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
