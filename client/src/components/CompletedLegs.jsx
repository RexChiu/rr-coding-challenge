import React, { Component } from 'react';
import { Line } from 'react-konva';

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
    lineArr = lineArr.concat(this.traceBackToStart(currentLegNode, this.props.stops, this.props.multiplier, []));
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

  // tail call recursive helper function to trace route back to beginning
  traceBackToStart = (currLeg, stops, multiplier, returnArr) => {
    // base case
    if (currLeg === null) {
      return returnArr;
    }
    // recursive case
    let legEndX = stops[currLeg.data.startStop].x * multiplier;
    let legEndY = stops[currLeg.data.startStop].y * multiplier;
    // creates a line connecting the stops of the current leg
    returnArr = returnArr.concat([legEndX, legEndY]);
    return this.traceBackToStart(currLeg.prev, stops, multiplier, returnArr);
  }
}

export default CompletedLegs;