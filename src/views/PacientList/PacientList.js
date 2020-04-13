import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import api from 'services/api';

import Header from 'components/Header/Header';
import Loading from 'components/Loading/Loading';

import './PacientList.scss';

const PacientList = ({ history }) => {
  const [loading, setLoading] = useState(true);
  const [pacients, setPacients] = useState([]);
  const [error, setError] = useState(null);
  const [CPF, setCPF] = useState(null);
  const [name, setName] = useState(null);
  const [birthdate, setBirthdate] = useState(null);
  const [unit, setUnit] = useState(null);
  const [reportDate, setReportDate] = useState(null);

  useEffect(() => {
    const fetchPacients = async () => {
      try {
        setLoading(true);
        const res = await api.post('/pacient/list', { page_index: 0, page_size: 0, order_by: 'ALPHABETICAL' });
        console.log(res);
        setPacients(res);
        setLoading(false);
      } catch (err) {
        console.error(err);
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
    fetchPacients();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    // TODO: Filter
    console.log(`filters: ${CPF}, ${name}, ${birthdate}, ${unit}, ${reportDate}`);
  };

  return (
    <>
      <Header />
      {loading && <Loading />}
      <div id="pacient-list" className="container">
        <div className="filters card">
          <h5 className="title is-5">Pacientes</h5>
          <hr />
          <form onSubmit={handleFilter}>
            <div className="field">
              <p className="control">
                <label className="label">CPF</label>
                <input className="input" type="text" onChange={(e) => setCPF(e.target.value)} disabled={loading} />
              </p>
            </div>
            <div className="field">
              <p className="control">
                <label className="label">Nome</label>
                <input className="input" type="text" onChange={(e) => setName(e.target.value)} disabled={loading} />
              </p>
            </div>
            <div className="field">
              <p className="control">
                <label className="label">Unidade</label>
                <input className="input" type="text" onChange={(e) => setUnit(e.target.value)} disabled={loading} />
              </p>
            </div>
            <div className="field">
              <p className="control">
                <label className="label">Data de nascimento</label>
                <input className="input" type="text" onChange={(e) => setBirthdate(e.target.value)} disabled={loading} />
              </p>
            </div>
            <div className="field">
              <p className="control">
                <label className="label">Data de Cadastro</label>
                <input className="input" type="text" onChange={(e) => setReportDate(e.target.value)} disabled={loading} />
              </p>
            </div>
            <div className="field">
              <p className="control">
                <button type="submit" className="button is-success" disabled={loading}>
                  Filtrar
                </button>
              </p>
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
          { pacients }
          <table className="table">
            <thead>
              <tr>
                <th><abbr title="Cadastro de Pessoa Física">CPF</abbr></th>
                <th>Nome</th>
                <th>Unidade</th>
                <th>Data de nascimento</th>
                <th>Data de cadastro</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>350.799.198-50</td>
                <td>André Seiji Tamanaha</td>
                <td>Hospital Brasil</td>
                <td>08/07/1992</td>
                <td>10/04/2020</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default withRouter(PacientList);
