import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { withRouter } from 'react-router-dom';

import * as moment from 'moment';

import api from 'services/api';

import InputMask from 'react-input-mask';

import Header from 'components/Header/Header';
import Loading from 'components/Loading/Loading';

import './PacientEdit.scss';

const PacientEdit = ({ history }) => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
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
  const [address, setAddress] = useState({});
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchPacient = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/pacient/${id}`);
        setCPF(res.data.cpf);
        setPacientName(res.data.name);
        setMotherName(res.data.mother_name);
        setSex(res.data.sex);
        setSexOrientation(res.data.sex_orientation === 'null' ? null : res.data.sex_orientation);
        setPhoneNumber(res.data.phone_number);
        setBirthdate(moment(res.data.birth_date, 'YYYY-MM-DD').format('DD/MM/YYYY'));
        if (res.data.address.complement === 'null') res.data.address.complement = null;
        setAddress(res.data.address);
        setReports(res.data.reports);
        setLoading(false);
      } catch (err) {
        if (err && err.message && err.message === 'Network Error') {
          setError(err.message);
          window.scrollTo(0, 0);
        } else if (err && err.response && err.response.status
            && (err.response.status === 404 || err.response.status === 409)) {
          history.push('/404');
        } else if (err && err.response && err.response.error) {
          setError(err.response.error);
          window.scrollTo(0, 0);
        } else {
          setError('Erro ao obter paciente');
          window.scrollTo(0, 0);
        }
        setLoading(false);
      }
    };
    fetchPacient();
    // eslint-disable-next-line
  }, [id]);

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
        reports
      };
      try {
        setLoading(true);
        await api.put('/create/pacient', { pacient });
        history.push(`/pacient/${cpf}`);
      } catch (err) {
        if (err && err.message && err.message === 'Network Error') {
          setError('Erro de conexão');
        } else if (err && err.response && err.response.status
            && (err.response.status === 401 || err.response.status === 403)) {
          history.push('/');
        } else {
          setError('Erro ao editar paciente');
        }
        setLoading(false);
      }
    }
  };

  const handleReportChange = (value, field, id) => {
    const update = [...reports];
    update.forEach((data) => {
      if (data.report.report_ID === id && field === 'covid_exam') {
        data.report = {
          ...data.report,
          [field]: value === 'true' || value === true
        };
        if (!(value === 'true' || value === true)) {
          data.report = {
            ...data.report,
            covid_result: ''
          };
        }
      } else if (data.report.report_ID === id) {
        data.report = {
          ...data.report,
          [field]: value
        };
      }
    });
    setReports(update);
  };

  const handleSituation = (value, id) => {
    const newReports = [...reports];
    newReports.forEach((data) => {
      if (data.report.report_ID === id) {
        const items = data.report.situation.split(',');
        if (!items.includes(value)) {
          const newArr = [...items];
          newArr.push(value);
          data.report.situation = newArr.join();
        } else {
          const newArr = items.filter((v) => v !== value);
          data.report.situation = newArr.join();
        }
      }
    });
    setReports(newReports);
  };

  const handleComorbidity = (value, id) => {
    const newReports = [...reports];
    newReports.forEach((data) => {
      if (data.report.report_ID === id) {
        const items = data.report.comorbidity.split(',');
        if (!items.includes(value)) {
          const newArr = [...items];
          newArr.push(value);
          data.report.comorbidity = newArr.join();
        } else {
          const newArr = items.filter((v) => v !== value);
          data.report.comorbidity = newArr.join();
        }
      }
    });
    setReports(newReports);
  };

  const handleSymptom = (value, id) => {
    const newReports = [...reports];
    newReports.forEach((data) => {
      if (data.report.report_ID === id) {
        const items = data.report.symptoms.map((s) => (s.name));
        if (!items.includes(value)) {
          const newArr = [...items];
          newArr.push(value);
          data.report.symptoms = newArr.map((s) => ({ name: s }));
        } else {
          const newArr = items.filter((v) => v !== value);
          data.report.symptoms = newArr.map((s) => ({ name: s }));
        }
      }
    });
    setReports(newReports);
  };

  const reportSituation = (value, id) => {
    let ret = false;
    reports.forEach((data) => {
      if (data.report.report_ID === id) {
        const items = data.report.situation.split(',');
        items.forEach((item) => {
          if (item === value) ret = true;
        });
      }
    });
    return ret;
  };

  const reportComorbidity = (value, id) => {
    let ret = false;
    reports.forEach((data) => {
      if (data.report.report_ID === id) {
        const items = data.report.comorbidity.split(',');
        items.forEach((item) => {
          if (item === value) ret = true;
        });
      }
    });
    return ret;
  };

  const reportSymptom = (value, id) => {
    let ret = false;
    reports.forEach((data) => {
      if (data.report.report_ID === id) {
        data.report.symptoms.forEach((item) => {
          if (item.name === value) ret = true;
        });
      }
    });
    return ret;
  };

  return (
    <>
      <Header />
      {loading && <Loading />}
      <div id="pacient-edit" className="container">
        <div className="card">
          <h3 className="title is-3">Editar Paciente</h3>
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
                  <InputMask mask="999.999.999-99" className="input" type="text" value={cpf} disabled />
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
                <label className="label">Unidade de referência (APENAS SECRETARIA DE SAÚDE)</label>
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
                      <option value="">Selecione...</option>
                      {referenceUnits.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <h4 className="title is-4">Laudos</h4>
            {reports.map((data) => (
              <div key={data.report.report_ID} className="report">
                <div className="columns">
                  <div className="field column">
                    <label className="label">Origem dos dados*</label>
                    <div className="control">
                      <div className="select">
                        <select
                          value={data.report.data_origin}
                          onChange={
                            (e) => {
                              const { value } = e.target;
                              handleReportChange(value, 'data_origin', data.report.report_ID);
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
                        value={moment(data.report.notification_date, 'YYYY-MM-DD').format('DD/MM/YYYY')}
                        onChange={
                          (e) => {
                            const { value } = e.target;
                            handleReportChange(value, 'notification_date', data.report.report_ID);
                          }
                        }
                        disabled
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
                        value={moment(data.report.symptoms_start_date, 'YYYY-MM-DD').format('DD/MM/YYYY')}
                        onChange={
                          (e) => {
                            const { value } = e.target;
                            handleReportChange(value, 'symptons_start_date', data.report.report_ID);
                          }
                        }
                        disabled
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
                          value={data.report.covid_exam}
                          onChange={
                            (e) => {
                              const { value } = e.target;
                              handleReportChange(value, 'covid_exam', data.report.report_ID);
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
                          value={data.report.covid_result}
                          onChange={
                            (e) => {
                              const { value } = e.target;
                              handleReportChange(value, 'covid_result', data.report.report_ID);
                            }
                          }
                          disabled={loading || !data.report.covid_exam}
                        >
                          <option value="" disabled>Selecione...</option>
                          {data.report.covid_exam && (<option value="Positivo">Positivo</option>)}
                          {data.report.covid_exam && (<option value="Negativo">Negativo</option>)}
                          {data.report.covid_exam && (<option value="Aguardando">Aguardando</option>)}
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
                        <button key={situation} type="button" className={`choice ${reportSituation(situation, data.report.report_ID) ? 'active' : null}`} onClick={() => handleSituation(situation, data.report.report_ID)}>{situation}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="columns">
                  <div className="field column">
                    <label className="label">Comorbidade</label>
                    <div className="choice-group">
                      {comorbidities.map((comorbidity) => (
                        <button key={comorbidity} type="button" className={`choice ${reportComorbidity(comorbidity, data.report.report_ID) ? 'active' : null}`} onClick={() => handleComorbidity(comorbidity, data.report.report_ID)}>{comorbidity}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="columns">
                  <div className="field column">
                    <label className="label">Sintomas*</label>
                    <div className="choice-group">
                      {symptoms.map((symptom) => (
                        <button key={symptom} type="button" className={`choice ${reportSymptom(symptom, data.report.report_ID) ? 'active' : null}`} onClick={() => handleSymptom(symptom, data.report.report_ID)}>{symptom}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <hr />
            <div className="field">
              <p className="control button-container">
                <button type="submit" className="button is-success" disabled={loading}>
                  Editar paciente
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default withRouter(PacientEdit);
