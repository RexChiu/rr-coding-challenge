import React from 'react';
import { Line } from 'react-konva';

// function to draw the completed legs of the driver
function drawCompletedLegs(props) {
  // find the current leg node
  let currentLegNode = props.legs.find(props.currentLeg);
  // create an array containing the completed lines
  let lineArr = [];
  lineArr = lineArr.concat(traceBackToStart(currentLegNode, props.stops, props.multiplier, []));
  return (
    <Line
      key={"LineCats"}
      x={props.offset}
      y={0}
      points={lineArr}
      stroke="green"
      strokeWidth={5}
    />
  )
}

// tail call recursive helper function to trace route back to beginning
function traceBackToStart(currLeg, stops, multiplier, returnArr) {
  // base case
  if (currLeg === null) {
    return returnArr;
  }
  // recursive case
  let legEndX = stops[currLeg.data.startStop].x * multiplier;
  let legEndY = stops[currLeg.data.startStop].y * multiplier;
  // creates a line connecting the stops of the current leg
  returnArr = returnArr.concat([legEndX, legEndY]);
  return traceBackToStart(currLeg.prev, stops, multiplier, returnArr);
}

export default drawCompletedLegs;