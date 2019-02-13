module.exports = {
  // function to calculate the distance between two points
  calculateDistance: function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  },

  // tail call recursive helper function to trace route back to beginning
  traceStops: function traceStops(currLeg, direction, stopType, stops, multiplier, returnArr) {
    // base case
    if (currLeg === null || currLeg === undefined) {
      return returnArr;
    }
    // recursive case
    let legEndX = stops[currLeg.data[stopType]].x * multiplier;
    let legEndY = stops[currLeg.data[stopType]].y * multiplier;
    // creates a line connecting the stops of the current leg
    returnArr = returnArr.concat([legEndX, legEndY]);
    return traceStops(currLeg[direction], direction, stopType, stops, multiplier, returnArr);
  },

  // tail call recursive function to calculate the trip time from a given node to the end
  calculateTripTimeToEnd: function calculateTripTimeToEnd(currLeg, tripTime, stops) {
    // base case
    if (currLeg === null) {
      return tripTime.toFixed(2) + " TUs";
    }
    // recursive case
    // calculates the distance, divides the distance by the speed limit
    let startStop = currLeg.data.startStop;
    let endStop = currLeg.data.endStop;
    let distance = module.exports.calculateDistance(stops[startStop].x, stops[startStop].y, stops[endStop].x, stops[endStop].y);
    let timeNeeded = distance / currLeg.data.speedLimit;
    return calculateTripTimeToEnd(currLeg.next, tripTime + timeNeeded, stops);
  }
}