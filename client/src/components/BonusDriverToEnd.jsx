import React, { Component } from 'react';
import { Line } from 'react-konva';
import helper from '../helpers/helper';

// function to draw a line from the bonus driver to the closest stop and the end
class BonusDriverToEnd extends Component {
  render() {
    let closestStop = this.findClosestStop();
    let closestStopX = closestStop.x * this.props.multiplier;
    let closestStopY = closestStop.y * this.props.multiplier;
    let bonusDriverX = this.props.bonusDriver.x * this.props.multiplier;
    let bonusDriverY = this.props.bonusDriver.y * this.props.multiplier;
    let legNode = this.findLegGivenStartStop(closestStop);
    let pathToEnd = helper.traceStops(legNode, "next", "endStop", this.props.stops, this.props.multiplier, []);

    return (
      <Line
        key="bonusDriverToClosest"
        x={this.props.offset}
        y={0}
        points={[bonusDriverX, bonusDriverY, closestStopX, closestStopY].concat(pathToEnd)}
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
      if (distance <= minDistance) {
        minDistance = distance;
        closestStop = stop;
      }
    }
    return closestStop;
  }

  // function to find the leg node given start stop
  findLegGivenStartStop = (startStop) => {
    for (let leg of this.props.rawLegs) {
      if (leg.startStop === startStop.name) {
        return this.props.legs.find(leg);
      }
    }
  }
}

export default BonusDriverToEnd;