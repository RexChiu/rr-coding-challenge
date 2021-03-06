// takes in an array of stops and parses it into a hashmap
module.exports = (stops) => {
  let parsedStops = {};
  stops.forEach((stop) => {
    parsedStops[stop.name] = stop;
  })
  return parsedStops;
}