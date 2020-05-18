import React from 'react';
import ReactDOM from 'react-dom';
import App from 'views/App/App';

import 'bulma/css/bulma.css';
import './styles/index.css';

import moment from 'moment';
import 'moment/locale/pt-br';
moment.locale('pt-br');

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
