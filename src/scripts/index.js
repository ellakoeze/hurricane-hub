import '../styles/index.scss';
const React = require('react');
const ReactDOM = require('react-dom');
const e = React.createElement;
const hurricanes = require('../data/hurricanes.json');


import { DataView } from '../scripts/dataview.js';
import { DownloadCSV } from '../scripts/download.js';

new DownloadCSV({
  el: '#top-download',
  data: hurricanes,
  parent: '#top-download-container'
});


// ========================================

ReactDOM.render(
  e(DataView),
  document.getElementById('root')
);


