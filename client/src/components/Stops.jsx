import React, { Component } from 'react';
import { Rect } from 'react-konva';

// function to generates a rect for every stop
class Stops extends Component {
  // lifecycle method to stop the rerendering of a completely static thing unless needed
  shouldComponentUpdate(nextProps) {
    return (nextProps.offset !== this.props.offset) ? true : false;
  }

  render() {
    let stopsArr = [];
    Object.values(this.props.stops).forEach((stop) => {
      let length = 10;
      stopsArr.push(
        <Rect
          /* scaling the coordintes by x5 and shifting to center*/
          x={this.props.offset + stop.x * this.props.multiplier - length / 2}
          y={stop.y * this.props.multiplier - length / 2}
          width={length}
          height={length}
          fill="red"
          key={stop.name}
        />
      )
    });
    return stopsArr;
  }
}

export default Stops;