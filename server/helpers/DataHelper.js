// defines operations on the supplied db
module.exports = function makeDataHelpers(db) {
  return {
    getLegs() {
      return db.legs;
    },
    getStops() {
      return db.stops;
    }
  }
}