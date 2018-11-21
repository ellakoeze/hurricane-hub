const React = require('react');
const ReactDOM = require('react-dom');
const e = React.createElement;
const topojson =  require("topojson-client");
const topojsonS =  require("topojson-server");
const hurricanes = require('../data/hurricanes.json');
const hurricaneShapes = require('../data/hurricanes.topo.json');
const hurricaneFeatures = topojson.feature(hurricaneShapes, hurricaneShapes.objects.hurricanes).features;
const countryShapes = require('../data/ne_110m_admin_0_countries.topo.json');
const countryFeatures = topojson.feature(countryShapes, countryShapes.objects.ne_110m_admin_0_countries).features;

import { DownloadCSV } from '../scripts/download.js';
import { ZoomMap} from '../scripts/map.js';
import {Table} from '../scripts/table.js';



class DataView extends React.Component {
    constructor(props) {
        super(props);
        this.state={
          data: hurricanes.sort((a, b)=>{
            if(a.Year < b.Year) return 1;
            if(a.Year> b.Year) return -1;
            return 0;
          }),
          direction: 'ascending',
          shapes: hurricaneShapes,
          countries: countryShapes
        };

        this.download = new DownloadCSV({
                    el: '#lower-download',
                    data: this.state.data,
                    parent: '#lower-download-container'
                  });
    }

  sort(param) {
    document.getElementsByClassName("active")[0].classList.remove("active");
    document.getElementById(param).classList.add("active");

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
          e(ZoomMap, {key: 'map',shapes: this.state.shapes, countries: this.state.countries})
        ),
        e('table', {key: 'table',className:"table"},
          e('thead', null,
              e('tr',null,[
                e('th',{key: 'name', id:'Name', onClick: ()=>this.sort('Name')}, 'Name'),
                e('th', {key: 'year', id:'Year', className: 'active', onClick: ()=>this.sort('Year')}, 'Year'),
                e('th',{key: 'month', id: 'Month', onClick: ()=>this.sort('Month')}, 'Month'),
                e('th',{key: 'cat', id: 'Max_category_at_landfall', onClick: ()=>this.sort('Max_category_at_landfall')}, 'Max. category at landfall'),
                e('th',{key: 'wind', id: 'Max_windspeed', onClick: ()=>this.sort('Max_windspeed')}, 'Max. windspeed (mph)'),
                e('th',{key: 'rain', id: 'max_amount_rainfall', onClick: ()=>this.sort('max_amount_rainfall')}, 'Max. rainfall (in)')
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
