import React from 'react';
import helper from '../helpers/helper';

// function to calculate and display the total trip time
function TotalTripTime(props) {
  let head = props.legs.getHeadNode();
  let total = helper.calculateTripTimeToEnd(head, 0, props.stops);
  return (
    <div>
      <strong>Total Time</strong>
      <p>{total}</p>
    </div>
  )
}

export default TotalTripTime;