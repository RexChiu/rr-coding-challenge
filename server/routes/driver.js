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
    try {
      let driver = await db.setDriver(req.body);
      res.send(driver);
    } catch (err) {
      res.send(err);
    }
  })
  return router;
}