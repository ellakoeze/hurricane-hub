import '../styles/index.scss';
const React = require('react');
const ReactDOM = require('react-dom');
const e = React.createElement;

import { DataView } from '../scripts/table.js';


// ========================================

ReactDOM.render(
  e(DataView),
  document.getElementById('root')
);
