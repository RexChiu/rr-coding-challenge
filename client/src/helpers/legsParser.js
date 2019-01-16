const LinkedList = require('dbly-linked-list');

// takes in an array of legs, and parses it into a doubly linked list
module.exports = function legsParser(legs) {
  let parsedLegs = new LinkedList();
  legs.forEach((leg) => {
    parsedLegs.insert(leg);
  })
  return parsedLegs;
}