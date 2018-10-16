const React = require('react');
const ReactDOM = require('react-dom');
const e = React.createElement;
const hurricanes = require('../data/hurricanes.json');

import { DownloadCSV } from '../scripts/download.js';

new DownloadCSV({
  el: '#top-download',
  data: hurricanes,
  parent: '#top-download-container'
});



class Row extends React.Component {
  render() {
    console.log(this.props.value);
    return [
        e('td',  {key: 'name'}, this.props.value.Name),
        e('td',{key: 'year'}, this.props.value.Year),
        e('td',{key: 'month'}, this.props.value.Month)
      ];
  }
}

class Table extends React.Component {
	constructor(props) {
	    super(props);
	    this.data = hurricanes;
      this.createRows();
	  }

  createRows(){

    this.rows =[];

      for (var i=0; i<this.data.length; i++){
        this.rows.push(e('tr', {className:"row"},this.renderRow(i)));
      }
  }

  renderRow(i) {
    return e(Row,{
    	value: this.data[i],
    	onClick:() => this.handleClick(i)
    }, null);
  }

  render() {
    return (this.rows);
  }

  handleClick(i) {
      const squares = this.state.squares.slice();
      squares[i] = 'X';
      this.setState({squares: squares});
    }
}

class DataView extends React.Component {
  render() {
    return (
      e('div', {className:"table-holder"},
        e('table', {className:"table"},
          e('thead', null,[
            e('th',null, 'Name'),
            e('th', null, 'Year'),
            e('th',null, 'Month')
            ]),
          e('tbody', null,
          e(Table)
        )
        )
      )
    );
  }
}

// ========================================

export {DataView};
