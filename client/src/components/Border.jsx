import React from 'react';
import { Line } from 'react-konva';

// function to draw a black border around the ViewPort
function drawBorder(props) {
  return (<Line
    key="BorderCats"
    x={props.offset}
    y={0}
    points={[0, 0, 200 * props.multiplier, 0, 200 * props.multiplier, 200 * props.multiplier, 0, 200 * props.multiplier]}
    stroke="black"
    closed
  />);
}

export default drawBorder;