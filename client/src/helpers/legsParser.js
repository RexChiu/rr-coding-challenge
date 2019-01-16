// takes in an array of legs, and parses it into a hashmap
module.exports = (legs) => {
  let parsedLegs = {};
  legs.forEach((leg) => {
    parsedLegs[leg.legID] = leg;
    parsedLegs[leg.legID].highlight = false;
  })
  return parsedLegs;
}