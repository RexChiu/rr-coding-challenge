import React, { Component } from 'react';
import { Line } from 'react-konva';
import helper from '../helpers/helper';

// function to draw a line from the bonus driver to the closest stop
class BonusDriverToClosestStop extends Component {
  render() {
    let closestStop = this.findClosestStop();
    let closestStopX = closestStop.x * this.props.multiplier;
    let closestStopY = closestStop.y * this.props.multiplier;
    let bonusDriverX = this.props.bonusDriver.x * this.props.multiplier;
    let bonusDriverY = this.props.bonusDriver.y * this.props.multiplier;
    return (
      <Line
        key="bonusDriverToClosest"
        x={this.props.offset}
        y={0}
        points={[closestStopX, closestStopY, bonusDriverX, bonusDriverY]}
        stroke="red"
        strokeWidth={2}
      />
    );
  }

  // function to iterate through the list of stops, and compare distances to find the closest stop
  findClosestStop = () => {
    // sets a large placeholder min distance
    let minDistance = Number.MAX_SAFE_INTEGER;
    let closestStop = "";
    // calculates distance between bonusDriver and each stop, checks distance
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