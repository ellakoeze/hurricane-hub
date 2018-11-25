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
import {Options} from '../scripts/select.js';


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
        this.mapSelection = this.mapSelection.bind(this);
        this.clearFilter = this.clearFilter.bind(this);
        this.dataArrange();

  }

  dataArrange(){

    this.years = [];
    this.yearsReverse =[];

    for (var obj of hurricanes) {
      if(this.years.indexOf(obj.Year) == -1){
        this.years.push(obj.Year);
        this.yearsReverse.push(obj.Year);
      }
    }

    this.yearsReverse.reverse();
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

  mapSelection(storm){

    let filtered = hurricanes.filter((d)=>{return d.id == storm;});
    let filteredHurricanes =  hurricaneFeatures.filter((d)=>{return d.properties.ID2== storm;});
    let filteredShapes = topojsonS.topology({hurricanes: {type: 'FeatureCollection', features: filteredHurricanes}});
    this.setState({data: filtered, shapes: filteredShapes});

  }

  filter(){

    let twenty17 = this.state.shapes.arcs.length;
    let selected = document.getElementsByClassName('selected')[0];


    if(selected || twenty17 ==0){
      return;
    }

    
    ///collect all parameters here regardless of which one was last used!
    let minYear = document.getElementById('min-year').value;
    let maxYear = document.getElementById('max-year').value;
    let minCat = document.getElementById('min-cat').value;
    let maxCat = document.getElementById('max-cat').value;
    let minWind = document.getElementById('min-wind').value;
    let maxWind = document.getElementById('max-wind').value;

    //starting variables
    let filtered;
    let filteredShapes;
    let filteredHurricanes;

    //run all filters on table data, starting with full set
    filtered = hurricanes.filter((d)=>{return d.Year >= minYear;});
    filtered = filtered.filter((d)=>{return d.Year <= maxYear;});
    filtered = filtered.filter((d)=>{return d.Max_category_at_landfall <= maxCat;});
    filtered = filtered.filter((d)=>{return d.Max_category_at_landfall >= minCat;});
    filtered = filtered.filter((d)=>{return d.Max_windspeed <= maxWind;});
    filtered = filtered.filter((d)=>{return d.Max_windspeed >= minWind;});

    //run all filters on map data, starting with full set
    filteredHurricanes =  hurricaneFeatures.filter((d)=>{return +d.properties.Year >= minYear;});
    filteredHurricanes =  filteredHurricanes.filter((d)=>{return +d.properties.Year <= maxYear;});
    filteredHurricanes =  filteredHurricanes.filter((d)=>{return +d.properties.Max_catego<= maxCat;});
    filteredHurricanes =  filteredHurricanes.filter((d)=>{return +d.properties.Max_catego>= minCat;});
    filteredHurricanes =  filteredHurricanes.filter((d)=>{ return (+d.properties.Max_windsp<= maxWind && +d.properties.Max_windsp>= minWind);});

    //send filtered data to download button
    this.download.update(filtered);

    //turn filtered features back into topojson
    filteredShapes = topojsonS.topology({hurricanes: {type: 'FeatureCollection', features: filteredHurricanes}});

    //change state!
    this.setState({data: filtered, direction: this.state.direction, shapes: filteredShapes});

  }

  clearFilter(){
    this.setState({data: hurricanes, shapes: hurricaneShapes});
    let textDiv = document.getElementById('text');
    textDiv.innerHTML= ''; 
    let selected = document.getElementsByClassName('selected')[0];

    if(selected){
      selected.classList.remove('selected');
    }

    document.getElementById('min-year').value = 1953;
    document.getElementById('max-year').value = 2017;
    document.getElementById('min-cat').value = 1;
    document.getElementById('max-cat').value = 5;
    document.getElementById('min-wind').value = 0;
    document.getElementById('max-wind').value = 150;
    document.querySelector(`.range.max-wind`).innerHTML = `150 mph`;
    document.querySelector(`.range.min-wind`).innerHTML = `0 mph`;

    let buttons = document.getElementsByClassName('button-section');
    for (let button of buttons){
      button.classList.remove('off');
    }
    
  }

  rangeChange(param){
    this.filter();

    let suffix = param == 'min-wind' || param =='max-wind' ? 'mph' : '';
    let val = document.getElementById(param).value;
    document.querySelector(`.range.${param}`).innerHTML = `${val} ${suffix}`;


  }

  render() {
    return (
      e('div', {className:"data-view"},[
        e('div', {key: 'row-1',className: 'row-wrapper'}, 
          e('div',{key: 'form-wrapper', className: 'form-wrapper'},
            e('div', {key: 'button-section-1', className: 'button-section'}, 
              e('div', {key: 'button-wrap-1'}, 
                e('p', {key: 'label-1', className: 'button-label'}, 'Earliest year'),
                e('select', {key: 'select-1', id: 'min-year', className: 'select', onChange: (event)=>this.filter()}, 
                  e(Options, {data: this.yearsReverse}))
              ),
              e('div', {key: 'button-wrap-2'}, 
                e('p', {key: 'label-2', className: 'button-label'}, 'Latest year'),
                e('select', {key: 'select-2', id: 'max-year', className: 'select', onChange: (event)=>this.filter()}, 
                  e(Options, {data: this.years}))
              )
            ),
            e('div', {key: 'button-section-2', className: 'button-section'}, 
              e('div', {key: 'button-wrap-1'}, 
                e('p', {key: 'label-1', className: 'button-label'}, 'Minimum category'),
                e('select', {key: 'select-1', id: 'min-cat', className: 'select', onChange: (event)=>this.filter()}, 
                  e(Options, {data: [1,2,3,4,5]}))
              ),
              e('div', {key: 'button-wrap-2'}, 
                e('p', {key: 'label-2', className: 'button-label'}, 'Maximum category'),
                e('select', {key: 'select-2', id: 'max-cat', className: 'select', onChange: (event)=>this.filter()}, 
                  e(Options, {data: [5,4,3,2,1]}))
              )
            ),
            e('div', {key: 'button-section-3', className: 'button-section'}, 
              e('div', {key: 'button-wrap-1'}, 
                e('p', {key: 'label-1', className: 'button-label'}, 'Minimum windspeed'),
                e('div', {},
                  e('input', {key: 'select-1', type: 'range', min: 0, max: 150, defaultValue: 0, id: 'min-wind', className: 'range', onChange: (event)=>this.rangeChange('min-wind')}),
                  e('div', {className: 'range min-wind'}, '0 mph')
                )
              ),
              e('div', {key: 'button-wrap-2'}, 
                e('p', {key: 'label-2', className: 'button-label'}, 'Maximum windspeed'),
                e('div', {},
                  e('input', {key: 'select-2', type: 'range', min: 0, max: 150, id: 'max-wind', defaultValue: 150, className: 'range', onChange: (event)=>this.rangeChange('max-wind')}),
                  e('div', {className: 'range max-wind'}, '150 mph')
                )
              )
            ),
            e('button', {key: 'button', className: 'reset-button', onClick: ()=>this.clearFilter()}, 'Reset')
          ),
          e(ZoomMap, {key: 'map',shapes: this.state.shapes, countries: this.state.countries, select: this.mapSelection, clear: this.clearFilter})
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
            e(Table,  {data: this.state.data, click: this.mapSelection, clear:this.clearFilter })
          )
        )]
      )
    );
  }
}

// ========================================

export {DataView};
