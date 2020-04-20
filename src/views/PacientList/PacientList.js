import React, { useState, useEffect } from 'react';
import { withRouter, useLocation, Link } from 'react-router-dom';

import * as moment from 'moment';

import api from 'services/api';

import Header from 'components/Header/Header';
import Loading from 'components/Loading/Loading';

import './PacientList.scss';

const PacientList = ({ history }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pacients, setPacients] = useState([]);
  const [totalPacients, setTotalPacients] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderBy, setOrderBy] = useState('notification_date');

  const page_size = 10;

  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();

  const calcTotalPages = (nPacients) => {
    const carry = nPacients % page_size === 0 ? 0 : 1;
    return Math.floor(nPacients / page_size) + carry;
  };

  const fetchPacients = async (page, order) => {
    try {
      setLoading(true);
      const res = await api.post('/pacient/list', {
        list: {
          page_index: page || 1, page_size, order_by: order || 'notification_date'
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

  useEffect(() => {
    const page = query.get('page');
    if (page) {
      setCurrentPage(parseInt(page, 10));
    }
    const order = query.get('orderBy');
    if (order) {
      setOrderBy(order);
    }
    fetchPacients(page, order);
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
                    <option value="cpf">CPF</option>
                    <option value="name">Nome</option>
                    <option value="reference_unit">Unidade de Referência</option>
                  </select>
                </div>
              </div>
            </div>
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
                  <th>Data de Notificação</th>
                </tr>
              </thead>
              <tbody>
                {pacients.map((pacient) => (
                  <tr key={pacient.cpf} className="pacient-link" onClick={() => history.push(`pacient/${pacient.cpf}`)}>
                    <td>{pacient.cpf}</td>
                    <td>{pacient.name}</td>
                    <td>{pacient.reference_unit}</td>
                    <td>{moment(pacient.notification_date).format('DD/MM/YYYY')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav className="pagination" role="navigation" aria-label="pagination">
            <button type="button" className="pagination-previous" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Página anterior</button>
            <button type="button" className="pagination-next" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>Próxima página</button>
            <ul className="pagination-list">
              {/* <li>
                <button type="button" className="pagination-link">1</button>
              </li>
              <li>
                <span className="pagination-ellipsis">&hellip;</span>
              </li>
              <li>
                <button type="button" className="pagination-link">45</button>
              </li>
              <li>
                <button type="button" className="pagination-link is-current">46</button>
              </li>
              <li>
                <button type="button" className="pagination-link">47</button>
              </li>
              <li>
                <span className="pagination-ellipsis">&hellip;</span>
              </li>
              <li>
                <button type="button" className="pagination-link">86</button>
              </li> */}
            </ul>
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
