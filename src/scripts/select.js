const React = require('react');
const ReactDOM = require('react-dom');
const e = React.createElement;


class Option extends React.Component {
  render() {
    return [
        e('option', {key: `opt-${this.props.value}`,}, this.props.value),
      ];
  }
}


class Options extends React.Component {
	constructor(props) {
	    super(props);
      this.props = props;      
	  }

  // createSelect(){
  //   this.select =e('select', {key: `select`},this.renderOptions());   
  // }

  render() {

    this.options =[];

    for (var val of this.props.data){

      this.options.push(e(Option,{key: `opt-${val}`, value: val}, null));
    }

    return this.options;
  }

  // render() {
  //   this.createSelect();
  //   return (this.select);
  // }
}



// ========================================

export {Options};
