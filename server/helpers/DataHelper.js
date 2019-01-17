// defines operations on the supplied db
module.exports = function makeDataHelpers(db) {
  return {
    // gets the legs from the database
    getLegs() {
      return db.legs;
    },
    // gets the stops from the database
    getStops() {
      return db.stops;
    },
    // gets the driver from the database
    getDriver() {
      return db.driver;
    },
    // updates the driver in the database
    setDriver(driver) {
      db.driver = driver;
      return db.driver;
    }
  }
}