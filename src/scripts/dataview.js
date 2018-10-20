const React = require('react');
const ReactDOM = require('react-dom');
const e = React.createElement;
const topojson =  require("topojson-client");
const topojsonS =  require("topojson-server");
const hurricanes = require('../data/hurricanes.json');
const hurricaneShapes = require('../data/hurricanes.topo.json');
const hurricaneFeatures = topojson.feature(hurricaneShapes, hurricaneShapes.objects.hurricanes).features;

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

  filter(){

    ///collect all parameters here regardless of which one was last used!
    let minYear = document.getElementById('min-year').value;
    let maxYear = document.getElementById('max-year').value;

    //starting variables
    let filtered;
    let filteredShapes;
    let filteredHurricanes;

    //run all filters on table data, starting with full set
    filtered = hurricanes.filter((d)=>{return d.Year >= minYear;});
    filtered = filtered.filter((d)=>{return d.Year <= maxYear;});

    //run all filters on map data, starting with full set
    filteredHurricanes =  hurricaneFeatures.filter((d)=>{return d.properties.Year >= minYear;});
    filteredHurricanes =  filteredHurricanes.filter((d)=>{return d.properties.Year <= maxYear;});



    //send filtered data to download button
    this.download.update(filtered);

    //turn filtered features back into topojson
    filteredShapes = topojsonS.topology({hurricanes: {type: 'FeatureCollection', features: filteredHurricanes}});

    //change state!
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
            e('input', {key: 'input-1',type: 'range', min: 1953, max:2017, id: 'min-year',defaultValue: 1953, onChange: (event)=>this.filter()}),
            e('input', {key: 'input-2',type: 'range', min: 1953, max:2017, id: 'max-year', defaultValue: 2017, onChange: (event)=>this.filter()}),
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
