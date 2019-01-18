var express = require('express');
var router = express.Router();

module.exports = (db) => {
  /* GET driver location. */
  router.get('/', async (req, res, next) => {
    try {
      let driver = await db.getDriver();
      res.send(driver);
    } catch (err) {
      res.send(err);
    }
  });
  /* UPDATE driver location */
  router.put('/', async (req, res, next) => {
    // try/catch to handle finding a new leg
    try {
      // logic to catch 0, shifts driver down a leg
      if (req.body.legProgress == 0) {
        let currStartStop = req.body.activeLegID[0];
        req.body.activeLegID = await db.findLegIDwithEndStop(currStartStop);
        req.body.legProgress = "100";
      }
      // logic to catch 100, shifts driver up a leg
      else if (req.body.legProgress == 100) {
        let currEndStop = req.body.activeLegID[1];
        req.body.activeLegID = await db.findLegIDwithStartStop(currEndStop);
        req.body.legProgress = "0";
      }
    }
    catch (err) {
      // catches cases of not being able to find start/end stops
      // do nothing to driver
    }
    // try/catch to handle db errors
    try {
      let driver = await db.setDriver(req.body);
      res.send(driver);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  })
  return router;
}