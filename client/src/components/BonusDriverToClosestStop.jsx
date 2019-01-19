import React, { Component } from 'react';
import { Line } from 'react-konva';
import helper from '../helpers/helper';

// function to draw a line from the bonus driver to the closest stop
class BonusDriverToClosestStop extends Component {
  render() {
    console.log(this.findClosestStop());
    return (null);
  }

  findClosestStop = () => {
    // sets a large placeholder min distance
    let minDistance = Number.MAX_SAFE_INTEGER;
    let closestStop = "";
    for (let stop of this.props.rawStops) {
      let distance = helper.calculateDistance(this.props.bonusDriver.x, this.props.bonusDriver.y, stop.x, stop.y);
      if (distance < minDistance) {
        minDistance = distance;
        closestStop = stop;
      }
    }
    return closestStop;
  }
}

export default BonusDriverToClosestStop;