const React = require('react');
const ReactDOM = require('react-dom');
const e = React.createElement;
const topojson =  require("topojson-client");
const topojsonS =  require("topojson-server");
const hurricanes = require('../data/hurricanes.json');
const hurricaneShapes = require('../data/hurricanes.topo.json');

import { DownloadCSV } from '../scripts/download.js';
import { ZoomMap} from '../scripts/map.js';
import {Table} from '../scripts/table.js';



class DataView extends React.Component {
    constructor(props) {
        super(props);
        this.state={
          data: hurricanes,
          direction: 'ascending',
          shapes: hurricaneShapes
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
    let filteredShapes = this.state.shapes;
    let hurricanes = topojson.feature(this.state.shapes, this.state.shapes.objects.hurricanes).features;
    let filteredHurricanes = hurricanes;


    if (end =='min'){
      filtered = this.state.data.filter((d)=>{return d[param] >= val;});
      filteredHurricanes =  hurricanes.filter((d)=>{return d.properties[param] >= val;});
    }
    else if (end =='max'){
      filtered = this.state.data.filter((d)=>{return d[param] <= val;});
      filteredHurricanes =  hurricanes.filter((d)=>{return d.properties[param] <= val;});

    }
    else if(end == 'contains'){


    }

    this.download.update(filtered);
    filteredShapes = topojsonS.topology({hurricanes: {type: 'FeatureCollection', features: filteredHurricanes}});
    this.setState({data: filtered, direction: this.state.direction, shapes: filteredShapes});

  }

  clearFilter(){
    this.setState({data: hurricanes, shapes: hurricaneShapes});
  }

  render() {
    return (
      e('div', {className:"data-view"},[
        e('div', {key: 'row-wrapper',className: 'row-wrapper'}, 
          e('div',{key: 'form-wrapper', className: 'form-wrapper'},
            e('input', {key: 'input-1',type: 'range', min: 1953, max:2017, defaultValue: 1953, onChange: (event)=>this.filter(event, 'Year', 'min')}),
            e('input', {key: 'input-2',type: 'range', min: 1953, max:2017, defaultValue: 2017, onChange: (event)=>this.filter(event, 'Year', 'max')}),
            e('button', {key: 'button', onClick: ()=>this.clearFilter()}, 'Reset')
          ),
          e(ZoomMap, {key: 'map',shapes: this.state.shapes})
        ),
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
