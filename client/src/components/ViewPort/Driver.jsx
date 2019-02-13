import React from 'react';
import { Rect } from 'react-konva';

// function to draw the driver
function Driver(props) {
  let length = 15;
  return (
    <Rect
      /* scaling the coordintes by x5 and shifting to center*/
      x={props.offset + props.driver.x * props.multiplier - length / 2}
      y={props.driver.y * props.multiplier - length / 2}
      width={length}
      height={length}
      fill="blue"
    />
  )
}

export default Driver;