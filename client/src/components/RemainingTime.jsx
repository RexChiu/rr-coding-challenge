import React from 'react';
import helper from '../helpers/helper';

// function to calculate and display the total trip time
function RemainingTime(props) {
  // finds the leg node of current driver
  let currentLeg = null;
  props.rawLegs.forEach((leg) => {
    if (leg.legID === props.driver.activeLegID) {
      currentLeg = leg;
    }
  });
  let currentLegNode = props.legs.find(currentLeg);
  // find the distance from current driver position to current endStop
  let endStop = props.stops[currentLegNode.data.endStop];
  let distanceDriverToNextStop = helper.calculateDistance(props.driver.x, props.driver.y, endStop.x, endStop.y);
  let timeNeededDriverToNextStop = distanceDriverToNextStop / currentLegNode.data.speedLimit;
  let remainingTimeNeeded = helper.calculateTripTimeToEnd(currentLegNode.next, timeNeededDriverToNextStop, props.stops);
  return (
    <div>
      <strong>Remaining Time</strong>
      <p>{remainingTimeNeeded}</p>
    </div>
  );
}

export default RemainingTime;