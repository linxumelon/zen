import React, { Component } from 'react';
 
export default class ColorTemplate extends Component {
  render() {
    return (
      <li>{this.props.task.text}</li>
    );
  }
}
