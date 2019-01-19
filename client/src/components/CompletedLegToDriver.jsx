import React from 'react';
import { Line } from 'react-konva';

// function to draw the line from the last completed leg to driver
function drawCompletedLegToDriver(props) {
  let currentLeg = props.currentLeg;
  // draw line from legStart to driver
  let legStartX = props.offset + props.stops[currentLeg.startStop].x * props.multiplier;
  let legStartY = props.stops[currentLeg.startStop].y * props.multiplier;
  let legEndX = props.offset + props.driver.x * props.multiplier;
  let legEndY = props.driver.y * props.multiplier;
  return (
    <Line
      key={currentLeg.legID}
      x={0}
      y={0}
      points={[legStartX, legStartY, legEndX, legEndY]}
      stroke="green"
      strokeWidth={5}
    />
  )
}

export default drawCompletedLegToDriver;