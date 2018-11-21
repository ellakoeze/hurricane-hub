const React = require('react');
const ReactDOM = require('react-dom');
const e = React.createElement;
const reactMap = require('react-simple-maps');


class ZoomMap extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;  
    console.log(this.props);
  }
  render() {
    return(
      e('div', {id: 'map'} ,
        e(reactMap.ComposableMap, {width: 500, projection: 'robinson', projectionConfig: {
          scale: 200,
          xOffset: 100,
          yOffset: 50,
          rotation: [0,0,0],
          precision: 0.1,
          }}, 
          e(reactMap.ZoomableGroup, null, 
            e(reactMap.Geographies, {geography:this.props.countries}, 
              (geographies, projection) => geographies.map(geography => (
                e(reactMap.Geography, { 
                  key:geography.properties.ADMIN,
                  id: geography.properties.ADMIN,
                  className: 'country',
                  geography: geography,
                  projection: projection}
                )
              ))
            ),
            e(reactMap.Geographies, {geography:this.props.shapes}, 
              (geographies, projection) => geographies.map(geography => (
                e(reactMap.Geography, { 
                  key:geography.properties.ID2,
                  id: geography.properties.ID2,
                  className: 'hurricane',
                  geography: geography,
                  projection: projection}
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