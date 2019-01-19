import React, { Component } from 'react';
import { Line } from 'react-konva';
import helper from '../helpers/helper';

// function to draw the completed legs of the driver
class CompletedLegs extends Component {
  // lifecycle method to stop the rerendering unless current leg is changed
  shouldComponentUpdate(nextProps) {
    return (nextProps.currentLeg !== this.props.currentLeg || nextProps.offset !== this.props.offset) ? true : false;
  }

  render() {
    // find the current leg node
    let currentLegNode = this.props.legs.find(this.props.currentLeg);
    // create an array containing the completed lines
    let lineArr = [];
    lineArr = lineArr.concat(helper.traceStops(currentLegNode, "prev", "startStop", this.props.stops, this.props.multiplier, []));
    return (
      <Line
        key={"LineCats"}
        x={this.props.offset}
        y={0}
        points={lineArr}
        stroke="green"
        strokeWidth={5}
      />
    )
  }
}

export default CompletedLegs;