const React = require('react');
const ReactDOM = require('react-dom');
const e = React.createElement;


class Row extends React.Component {
  render() {
    let rain = this.props.value.max_amount_rainfall ? (Math.round(this.props.value.max_amount_rainfall* 10)/10).toFixed(1) : '';
    return [
        e('td',  {key: 'name', className: this.props.value.id}, this.props.value.Name),
        e('td',{key: 'year', className: this.props.value.id}, this.props.value.Year),
        e('td',{key: 'month', className: this.props.value.id}, this.props.value.Month),
        e('td',{key: 'category', className: this.props.value.id}, this.props.value.Max_category_at_landfall),
        e('td',{key: 'wind', className: this.props.value.id}, this.props.value.Max_windspeed),
        e('td',{key: 'rain', className: this.props.value.id}, rain)
      ];
  }
}


class Table extends React.Component {
	constructor(props) {
	    super(props);
      this.props = props;   

      this.table_hoverable= true;   
	  }

  createRows(){

    this.rows =[];
      for (var i=0; i<this.props.data.length; i++){
        this.rows.push(e('tr', {id: `${this.props.data[i].id}-row`, className:"row", key: `row-${i}`, onClick: (e)=>this.select(e), onMouseMove: (e)=>this.hover(e), onMouseLeave: (e)=>this.hoverOff(e)},this.renderRow(i)));
      }
  }

  select(e){
    let storm = e.target.classList[0];
    this.table_hoverable = false;
    this.props.click(storm);
    let stormShape = document.querySelector(`.hurricane#${storm}`);
    let event = document.createEvent("SVGEvents");
    event.initEvent("click",true,true);
    if(stormShape){
      stormShape.dispatchEvent(event);
    }
    else{
      let textDiv = document.getElementById('text');
      textDiv.innerHTML= '<p id="no-track">No track </p><div id="ex" >x</div>';    
      this.clear();
    }

    let buttons = document.getElementsByClassName('button-section');
    for (let button of buttons){
      button.classList.add('off');
    }
    this.props.reset();
  }

  clear(){
    let textDiv = document.getElementById('text');
    document.getElementById('ex').addEventListener('click', ()=>{
      textDiv.innerHTML= ''; 
      let selectedStorm = document.getElementsByClassName('selected')[0];
      if (selectedStorm){
        selectedStorm.classList.remove('selected');
      }
      this.props.clear();
      this.table_hoverable = true;
      let buttons = document.getElementsByClassName('button-section');
      for (let button of buttons){
        button.classList.remove('off');
      }
    });
  }

  hover(e){
    this.table_hoverable =document.getElementById('ex') ? false : true;
    if(!this.table_hoverable){
      return;
    }
    let storm = e.target.classList[0];
    let stormShape = document.querySelector(`.hurricane#${storm}`);
    let event = document.createEvent("SVGEvents");
    event.initEvent("mousemove",true,true);
    if(stormShape){
      stormShape.classList.add('selected');
      stormShape.dispatchEvent(event);
    }
    
  }

  hoverOff(e){
    this.table_hoverable =document.getElementById('ex') ? false : true;
    if(!this.table_hoverable){
          return;
    }
    let textDiv = document.getElementById('text');
    textDiv.innerHTML= ''; 
    let storm = e.target.classList[0];
    let stormShape = document.querySelector(`.hurricane#${storm}`);
    if(stormShape){
      stormShape.classList.remove('selected');
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
