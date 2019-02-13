import React, { Component } from 'react';
import { Line } from 'react-konva';

// function to draw a black border around the ViewPort
class Border extends Component {
  // lifecycle method to stop the rerendering of a completely static thing unless needed
  shouldComponentUpdate(nextProps) {
    return (nextProps.offset !== this.props.offset) ? true : false;
  }

  render() {
    return (<Line
      key="BorderCats"
      x={this.props.offset}
      y={0}
      points={[0, 0, 200 * this.props.multiplier, 0, 200 * this.props.multiplier, 200 * this.props.multiplier, 0, 200 * this.props.multiplier]}
      stroke="black"
      closed
    />)
  };
}

export default Border;