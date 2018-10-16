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
	    this.state={
        data: props.data
      };
      
	  }

  createRows(){

    this.rows =[];

      for (var i=0; i<this.state.data.length; i++){
        this.rows.push(e('tr', {className:"row", key: `row-${i}`},this.renderRow(i)));
      }
  }

  renderRow(i) {
    return e(Row,{
    	value: this.state.data[i]
    }, null);
  }

  render() {
    this.createRows();
    return (this.rows);
  }
}

class DataView extends React.Component {
    constructor(props) {
        super(props);
        this.state={
          data: hurricanes,
          direction: 'ascending'
        };
    }

  sort(param) {
    const data = this.state.data.sort((a, b)=>{
      if (this.state.direction == 'ascending'){

        if(a[param] < b[param]) return -1;
        if(a[param]> b[param]) return 1;
        return 0;
      }
      else{
        if(b[param] < a[param]) return -1;
        if(b[param]> a[param]) return 1;
        return 0;
      }
    });
    
    this.setState({data: data, direction: this.state.direction == 'ascending' ? 'descending' : 'ascending'});
  }


  render() {
    return (
      e('div', {className:"table-holder"},
        e('table', {className:"table"},
          e('thead', null,
              e('tr',null,[
                e('th',{key: 'name', id:'name-header', onClick: ()=>this.sort('Name')}, 'Name'),
                e('th', {key: 'year', id:'year-header', onClick: ()=>this.sort('Year')}, 'Year'),
                e('th',{key: 'month', id: 'month-header', onClick: ()=>this.sort('Month')}, 'Month')
              ])
          ),
          e('tbody', null,
            e(Table,  {data: this.state.data})
          )
        )
      )
    );
  }
}

// ========================================

export {DataView};
