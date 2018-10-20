const React = require('react');
const ReactDOM = require('react-dom');
const e = React.createElement;
const reactMap = require('react-simple-maps');
const hurricaneShapes = require('../data/hurricanes.topo.json');

console.log(hurricaneShapes);

// import {
//   ComposableMap,
//   ZoomableGroup,
//   Geographies,
//   Geography,
// } from "react-simple-maps"

class ZoomMap extends React.Component {
  render() {
    return(
      e('div', null ,
        e(reactMap.ComposableMap, null, 
          e(reactMap.ZoomableGroup, null, 
          e(reactMap.Geographies, {geography:hurricaneShapes}, 
            (geographies, projection) => geographies.map(geography => (
              e(reactMap.Geography, 
              { 
                key:geography.properties.ID2,
                geography: geography,
                projection: projection
              }
              )
            ))
          )
          )
        )
      )
    );
  }
}

export {ZoomMap};