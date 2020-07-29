import React, { useState, useEffect } from 'react';
import { withRouter, useLocation, Link } from 'react-router-dom';
import InputMask from 'react-input-mask';

import * as moment from 'moment';

import { referenceUnits } from 'data/enums';
import api from 'services/api';

import Header from 'components/Header/Header';
import Loading from 'components/Loading/Loading';

import './PacientList.scss';

  const useQuery = () => new URLSearchParams(useLocation().search);

const PacientList = ({ history }) => {
  const query = useQuery();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pacients, setPacients] = useState([]);
  const [totalPacients, setTotalPacients] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderBy, setOrderBy] = useState('notification_date');

  const [cpf, setCPF] = useState('');
  const [patientName, setPatientName] = useState('');
  const [notificationDate, setNotificationDate] = useState('');
  const [symptomsStartDate, setSymptomsStartDate] = useState('');
  const [referenceUnit, setReferenceUnit] = useState('');

  const page_size = 50;
  
  const calcTotalPages = (nPacients) => {
    const carry = nPacients % page_size === 0 ? 0 : 1;
    return Math.floor(nPacients / page_size) + carry;
  };

  const fetchPacients = async (page, order, filters) => {
    try {
      setLoading(true);
      const res = await api.post('/pacient/list', {
        list: {
          page_index: page || 1,
          page_size,
          order_by: order || 'notification_date',
          filter_by: filters
        }
      });
      setPacients(res.data.pacients);
      setTotalPacients(res.data.total_pacients);
      setTotalPages(calcTotalPages(res.data.total_pacients));
      setLoading(false);
    } catch (err) {
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

  const handleFilters = () => {
    let filters = {};
    if (cpf) {
      console.log('entrou')
      filters = { ...filters, cpf };
    }
    if (notificationDate) {
      filters = { ...filters, notification_date: moment(notificationDate, 'YYYY-MM-DD').format('DD/MM/YYYY') };
    }
    if (patientName) {
      filters = { ...filters, name: patientName };
    }
    if (referenceUnit) {
      filters = { ...filters, reference_unit: referenceUnit };
    }
    if (symptomsStartDate) {
      filters = { ...filters, symptoms_start_date: moment(symptomsStartDate, 'YYYY-MM-DD').format('DD/MM/YYYY') };
    }
    if (Object.entries(filters).length === 0) {
      fetchPacients(currentPage, orderBy, null);
    }
    else {
      fetchPacients(currentPage, orderBy, filters);
    }
  };

  const getFilters = () => {
    let filters = {};
    if (query.get('cpf')) {
      filters = { ...filters, cpf: query.get('cpf') };
      setCPF(query.get('cpf'));
    }
    if (query.get('notificationDate')) {
      filters = { ...filters, notification_date: moment(query.get('notificationDate'), 'YYYY-MM-DD').format('DD/MM/YYYY') };
      setNotificationDate(query.get('notificationDate'));
    }
    if (query.get('name')) {
      filters = { ...filters, name: query.get('name') };
      setPatientName(query.get('name'));
    }
    if (query.get('referenceUnit')) {
      filters = { ...filters, reference_unit: query.get('referenceUnit') };
      setReferenceUnit(query.get('referenceUnit'));
    }
    if (query.get('symptomsStartDate')) {
      filters = { ...filters, symptoms_start_date: moment(query.get('symptomsStartDate'), 'YYYY-MM-DD').format('DD/MM/YYYY') };
      setSymptomsStartDate(query.get('symptomsStartDate'));
    }
    if (Object.entries(filters).length === 0) {
      fetchPacients(currentPage, orderBy, null);
    }
    else {
      fetchPacients(currentPage, orderBy, filters);
    }
  };

  const setFilters = async () => {
    let filters = '';
    if (cpf) {
      filters = `cpf=${cpf}`;
    }
    if (notificationDate) {
      filters = `notificationDate=${moment(notificationDate, 'DD/MM/YYYY').format('YYYY-MM-DD')}`;
    }
    if (patientName) {
      filters = `name=${patientName}`;
    }
    if (referenceUnit) {
      filters = `referenceUnit=${referenceUnit}`;
    }
    if (symptomsStartDate) {
      filters = `symptomsStartDate=${moment(symptomsStartDate, 'DD/MM/YYYY').format('YYYY-MM-DD')}`;
    }
    const page = query.get('page');
    if (page) {
      filters = `page=${page}`;
    }
    const order = query.get('orderBy');
    if (order) {
      filters = `orderBy=${order}`;
    }
    history.replace({
      pathname: '/',
      search: filters ? `?${filters}` : ''
    });
    return 0;
  };

  const submitFilters = async (e) => {
    e.preventDefault();
    await setFilters();
    await handleFilters();
  };

  useEffect(() => {
    getFilters();
    // eslint-disable-next-line
  }, []);

  const handleOrderBy = (value) => {
    let queryParams = '';
    const page = query.get('page');
    if (page) {
      queryParams = `?page=${page}&orderBy=${value}`;
    } else {
      queryParams = `?orderBy=${value}`;
    }
    setOrderBy(value);
    history.replace({
      pathname: '/',
      search: queryParams
    });
    fetchPacients(page, value);
  };

  const handlePageChange = (value) => {
    let queryParams = `?page=${value}`;
    const order = query.get('orderBy');
    if (order) {
      queryParams = `?page=${value}&orderBy=${order}`;
    }
    setCurrentPage(value);
    history.replace({
      pathname: '/',
      search: queryParams
    });
    fetchPacients(value, order);
  };

  const getInitialPacient = () => (currentPage - 1) * page_size + 1;

  const getPagePacient = () => {
    const pagePacient = (currentPage - 1) * page_size + page_size;
    return pagePacient < totalPacients ? pagePacient : totalPacients;
  };

  return (
    <>
      <Header />
      {loading && <Loading />}
      {totalPacients && (
        <div id="pacient-list" className="container">
          <div className="filters card">
            <div className="filters-content">
              <div>
                <h3 className="title is-3">Pacientes</h3>
                <h6 className="title is-6">
                  {`Mostrando pacientes ${getInitialPacient()} - ${getPagePacient()} de ${totalPacients}`}
                </h6>
              </div>
              <div className="field is-horizontal">
                <div className="field-label">Ordenar por:</div>
                <div className="field-body">
                  <div className="select">
                    <select value={orderBy} onChange={(e) => handleOrderBy(e.target.value)}>
                      <option value="notification_date">Data de Notificação</option>
                      <option value="symptoms_start_date">Início dos Sintomas</option>
                      <option value="cpf">CPF</option>
                      <option value="name">Nome</option>
                      <option value="reference_unit">Unidade de Referência</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <form className="columns" onSubmit={(e) => submitFilters(e)}>
              <div className="field column">
                <label className="label">CPF</label>
                <div className="control">
                  <InputMask mask="999.999.999-99" className="input" type="text" value={cpf} onChange={(e) => setCPF(e.target.value)} disabled={loading} />
                </div>
              </div>
              <div className="field column">
                <label className="label">Nome</label>
                <div className="control">
                  <input className="input" type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} disabled={loading} />
                </div>
              </div>
              <div className="field column">
                <label className="label">Notificação</label>
                <div className="control">
                  <InputMask mask="99/99/9999" className="input" type="text" value={notificationDate} onChange={(e) => setNotificationDate(e.target.value)} disabled={loading} />
                </div>
              </div>
              <div className="field column">
                <label className="label">Início</label>
                <div className="control">
                  <InputMask mask="99/99/9999" className="input" type="text" value={symptomsStartDate} onChange={(e) => setSymptomsStartDate(e.target.value)} disabled={loading} />
                </div>
              </div>
              <div className="field column">
                <label className="label">Unidade</label>
                <div className="control">
                  <div className="select">
                    <select
                      value={referenceUnit}
                      onChange={(e) => setReferenceUnit(e.target.value)}
                      disabled={loading}
                    >
                      <option value="">Selecione...</option>
                      {referenceUnits.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="field column" style={{ marginBottom: 12 }}>
                <button type="submit" className="button is-success" disabled={loading}>
                  Filtrar
                </button>
              </div>
            </form>
          </div>
          <div className="pacient-list card">
            {error && (
              <div className="notification is-danger">
                <button type="button" className="delete" onClick={() => setError(null)} />
                {error}
              </div>
            )}
            {/* { pacients } */}
            <table className="table">
              <thead>
                <tr>
                  <th><abbr title="Cadastro de Pessoa Física">CPF</abbr></th>
                  <th>Nome</th>
                  <th>Unidade de Referência</th>
                  <th>Sintomas</th>
                  <th>Notificação</th>
                  <th>Período</th>
                </tr>
              </thead>
              <tbody>
                {pacients.map((pacient) => (
                  <tr key={pacient.cpf} className="pacient-link" onClick={() => history.push(`pacient/${pacient.cpf}`)}>
                    <td style={{ minWidth: 144 }}>{pacient.cpf}</td>
                    <td>{pacient.name}</td>
                    <td>{pacient.reference_unit}</td>
                    <td>{moment(pacient.symptoms_start_date).format('DD/MM/YYYY')}</td>
                    <td>{moment(pacient.notification_date).format('DD/MM/YYYY')}</td>
                    <td>{moment(pacient.symptoms_start_date).fromNow()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav className="pagination" role="navigation" aria-label="pagination">
            <button type="button" className="pagination-previous" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Página anterior</button>
            <button type="button" className="pagination-next" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>Próxima página</button>
          </nav>
        </div>
      )}
      {!loading && !totalPacients && (
        <div id="pacient-list" className="container">
          <div className="filters card">
            <div>
              <h3 className="title is-3">Pacientes</h3>
              <h6 className="title is-6">
                Nenhum paciente cadastrado.
                <Link to="/new-pacient"> Cadastre um novo paciente.</Link>
              </h6>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default withRouter(PacientList);
