import React from 'react';
import { Rect } from 'react-konva';

// function to generates a rect for every stop
function generateStops(props) {
  let stopsArr = [];
  Object.values(props.stops).forEach((stop) => {
    let length = 10;
    stopsArr.push(
      <Rect
        /* scaling the coordintes by x5 and shifting to center*/
        x={props.offset + stop.x * props.multiplier - length / 2}
        y={stop.y * props.multiplier - length / 2}
        width={length}
        height={length}
        fill="red"
        key={stop.name}
      />
    )
  });
  return stopsArr;
}

export default generateStops;