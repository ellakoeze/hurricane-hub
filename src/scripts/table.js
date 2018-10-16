const React = require('react');
const ReactDOM = require('react-dom');
const e = React.createElement;
const hurricanes = require('../data/hurricanes.json');

import { DownloadCSV } from '../scripts/download.js';


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
      this.props = props;      
	  }

  createRows(){

    this.rows =[];
      for (var i=0; i<this.props.data.length; i++){
        this.rows.push(e('tr', {className:"row", key: `row-${i}`},this.renderRow(i)));
      }
  }

  renderRow(i) {
    return e(Row,{
    	value: this.props.data[i]
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

        this.download = new DownloadCSV({
                    el: '#lower-download',
                    data: this.state.data,
                    parent: '#lower-download-container'
                  });
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

  filter(event, param, end){

    let val = event.target.value;
    let filtered = this.state.data;

    if (end =='min'){
      filtered = this.state.data.filter((d)=>{return d[param] >= val;});
    }
    else{
      filtered = this.state.data.filter((d)=>{return d[param] <= val;});
    }

    this.download.update(filtered);

    this.setState({data: filtered, direction: this.state.direction});

  }

  clearFilter(){
    this.setState({data: hurricanes});
  }

  render() {
    return (
      e('div', {className:"table-holder"},[
        e('input', {key: 'input',type: 'range', min: 1953, max:2017, onChange: (event)=>this.filter(event, 'Year', 'min')}),
        e('button', {key: 'button', onClick: ()=>this.clearFilter()}, 'Reset'),
        e('table', {key: 'table',className:"table"},
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
        )]
      )
    );
  }
}

// ========================================

export {DataView};
