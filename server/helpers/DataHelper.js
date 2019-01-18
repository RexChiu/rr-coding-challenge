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
    },
    // function to find the legID of a given startStop
    findLegIDwithStartStop(startStop) {
      for (let leg of db.legs) {
        if (leg.startStop == startStop) {
          return leg.legID;
        }
      };
      return Promise.reject("Cannot find start stop");
    },
    // function to find the legID of a given endStop
    findLegIDwithEndStop(endStop) {
      for (let leg of db.legs) {
        if (leg.endStop == endStop) {
          return leg.legID;
        }
      };
      return Promise.reject("Cannot find end stop");
    }
  }
}