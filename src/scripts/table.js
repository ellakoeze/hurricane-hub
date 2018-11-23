const React = require('react');
const ReactDOM = require('react-dom');
const e = React.createElement;


class Row extends React.Component {
  render() {
    return [
        e('td',  {key: 'name', className: this.props.value.id}, this.props.value.Name),
        e('td',{key: 'year', className: this.props.value.id}, this.props.value.Year),
        e('td',{key: 'month', className: this.props.value.id}, this.props.value.Month),
        e('td',{key: 'category', className: this.props.value.id}, this.props.value.Max_category_at_landfall),
        e('td',{key: 'wind', className: this.props.value.id}, this.props.value.Max_windspeed),
        e('td',{key: 'rain', className: this.props.value.id}, (Math.round(this.props.value.max_amount_rainfall* 10)/10).toFixed(1))
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
        this.rows.push(e('tr', {id: `${this.props.data[i].id}-row`, className:"row", key: `row-${i}`, onClick: (e)=>this.select(e)},this.renderRow(i)));
      }
  }

  select(e){
    let storm = e.target.classList[0];
    this.props.click(storm);
    let stormShape = document.querySelector(`.hurricane#${storm}`);
    let event = document.createEvent("SVGEvents");
    event.initEvent("click",true,true);
    if(stormShape){
      stormShape.dispatchEvent(event);
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
