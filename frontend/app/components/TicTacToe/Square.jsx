import React, { Component } from 'react';

class Square extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
      return (
        <div className="square" onClick={this.props.onClick}>
          {this.props.value}
        </div>
      );
    }
}
export default Square