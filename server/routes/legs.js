var express = require('express');
var router = express.Router();

module.exports = (db) => {
  /* GET legs listing. */
  router.get('/', async (req, res, next) => {
    try {
      let legs = await db.getLegs();
      res.send(legs);
    } catch (err) {
      res.send(err);
    }
  });
  return router;
}