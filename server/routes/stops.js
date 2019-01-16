var express = require('express');
var router = express.Router();

module.exports = (db) => {
  /* GET stops listing. */
  router.get('/', async (req, res, next) => {
    try {
      let stops = await db.getStops();
      res.send(stops);
    } catch (err) {
      res.send(err);
    }
  });
  return router;
}