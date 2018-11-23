const React = require('react');
const ReactDOM = require('react-dom');
const e = React.createElement;
const reactMap = require('react-simple-maps');
import {Motion, spring} from 'react-motion';


class ZoomMap extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;  
    this.state = {
      zoom: 1.5,
      center: [0,10],
      panning: false
    };

    this.handleZoomIn = this.handleZoomIn.bind(this);
    this.handleZoomOut = this.handleZoomOut.bind(this);
    this.colors ={
      cat5: 'red',
      cat4: 'orange',
      cat3: 'yellow',
      cat2: 'green',
      cat1: 'blue;'
    };

    this.hoverable = true;
  }

  handleZoomIn() {
    this.setState({
      zoom: this.state.zoom *1.25,
      panning: false
    });
  }

  handleDoubleClick() {
    this.setState({
      zoom: this.state.zoom *2,
      panning: false
    });
  }

  handleZoomOut() {
    this.setState({
      zoom: this.state.zoom >1 ? this.state.zoom /1.25 : 1,
      panning: this.state.zoom >1 ? false : true
    });
  }

  handleZoomOutAllTheWay() {
    let newCenter = this.state.center[1] == 10 ? [0,9] :[0,10];
    this.setState({
      zoom: 1.5,
      center: newCenter,
      panning: false
    });
  }

  hoverHurricane(storm) {
    if (!this.hoverable){
      return;
    }
    let textDiv = document.getElementById('text');                              
    textDiv.innerHTML= storm; 

  }

  leaveHurricane() {
    if (!this.hoverable){
      return;
    }
    let textDiv = document.getElementById('text');
    textDiv.innerHTML= ''; 
    

  }

  clickHurricane(storm) { 
    document.getElementById(storm).classList.add('selected');
    let textDiv = document.getElementById('text');                              
    textDiv.innerHTML= storm +'<div id="ex" >X</div>';

    this.hoverable = false;
    this.clearSelection();

  }

  clearSelection(){
    let textDiv = document.getElementById('text');
    document.getElementById('ex').addEventListener('click', ()=>{
      textDiv.innerHTML= ''; 
      this.hoverable = true;
      document.getElementsByClassName('selected')[0].classList.remove('selected');
    });
  }

  render() {
    return(
      e('div', {id: 'map-wrap'} , null,
        e('div', {id: 'button-wrap'} , null,
          e('button', {className: 'zoom-button', onClick: ()=>this.handleZoomIn()}, "Zoom in"),
          e('button', {className: 'zoom-button', onClick: ()=>this.handleZoomOut()}, "Zoom out"),
          e('button', {className: 'zoom-button', onClick: ()=>this.handleZoomOutAllTheWay()}, "Reset zoom"),
          e('div', {id: 'text'})),
        e('div', {id: 'map', onDoubleClick:()=>this.handleDoubleClick()},
          e(Motion, {defaultStyle:{zoom: 1, x: 0, y: 20},
                     style:{zoom: spring(this.state.zoom, {stiffness: 120, damping: 17})}},
            ({zoom,x,y}) => (
              e(reactMap.ComposableMap, {projection: 'robinson', projectionConfig: {
                scale: 200,
                xOffset: 100,
                yOffset: 50,
                rotation: [-10,0,0]
                }}, 
                e(reactMap.ZoomableGroup, {disablePanning: this.state.panning, center:this.state.center, zoom:zoom}, 
                  e(reactMap.Geographies, {geography:this.props.countries}, 
                    (geographies, projection) => geographies.map(geography => (
                      e(reactMap.Geography, { 
                        key:geography.properties.ADMIN,
                        id: geography.properties.ADMIN,
                        className: 'country',
                        geography: geography,
                        projection: projection,
                        style:{
                          default: {
                            fill: "#ECEFF1",
                            stroke: "#607D8B",
                            strokeWidth: 0.75,
                            outline: "none"
                          },
                          hover: {
                            fill: "#ECEFF1",
                            stroke: "#607D8B",
                            strokeWidth: 0.75,
                            outline: "none"
                          },
                          pressed: {
                            fill: "#ECEFF1",
                            stroke: "#607D8B",
                            strokeWidth: 0.75,
                            outline: "none"
                          }
                        }
                      })
                    ))
                  ),
                  e(reactMap.Geographies, {geography:this.props.shapes}, 
                    (geographies, projection) => geographies.map(geography => (
                      e(reactMap.Geography, { 
                        key:geography.properties.ID2,
                        id: geography.properties.ID2,
                        className: 'hurricane',
                        geography: geography,
                        projection: projection,
                        onClick: ()=>this.clickHurricane(geography.properties.ID2),
                        onMouseMove: ()=>this.hoverHurricane(geography.properties.ID2),
                        onMouseLeave: ()=>this.leaveHurricane(),
                        style:{
                          default: {
                          stroke:  "#F87903",
                          strokeWidth: 0.5,
                          outline: "none",
                          opacity: 1,
                          strokeLinecap: "round"
                          }
                        }}
                      )
                    ))
                  )
                )
              )
            )
          )
        )
      )
    );
  }
}

export {ZoomMap};