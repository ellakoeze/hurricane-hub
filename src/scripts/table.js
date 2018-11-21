const React = require('react');
const ReactDOM = require('react-dom');
const e = React.createElement;


class Row extends React.Component {
  render() {
    return [
        e('td',  {key: 'name'}, this.props.value.Name),
        e('td',{key: 'year'}, this.props.value.Year),
        e('td',{key: 'month'}, this.props.value.Month),
        e('td',{key: 'category'}, this.props.value.Max_category_at_landfall),
        e('td',{key: 'wind'}, this.props.value.Max_windspeed),
        e('td',{key: 'rain'}, (Math.round(this.props.value.max_amount_rainfall* 10)/10).toFixed(1))
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



// ========================================

export {Table};
