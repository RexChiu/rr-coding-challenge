import React from 'react';
import { Rect } from 'react-konva';

// function to draw the bonus driver
function BonusDriver(props) {
  // doesn't render anything if no bonus driver
  if (props.bonusDriver.x === "" || props.bonusDriver.y === "") {
    return (null);
  }
  let length = 15;
  return (
    <Rect
      /* scaling the coordintes by x5 and shifting to center*/
      x={props.offset + props.bonusDriver.x * props.multiplier - length / 2}
      y={props.bonusDriver.y * props.multiplier - length / 2}
      width={length}
      height={length}
      fill="blue"
    />
  )
}

export default BonusDriver;