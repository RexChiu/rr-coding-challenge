module.exports = (stops) => {
  let parsedStops = {};
  stops.forEach((stop) => {
    parsedStops[stop.name] = stop;
  })
  return parsedStops;
}