var express = require('express');
var router = express.Router();

module.exports = (db, aWss) => {
  /* GET bonus driver location. */
  router.get('/', async (req, res, next) => {
    try {
      let bonusdriver = await db.getBonusDriver();
      res.send(bonusdriver);
    } catch (err) {
      res.send(err);
    }
  });
  /* UPDATE bonus driver location */
  router.put('/', async (req, res, next) => {
    // update bonus driver in db
    try {
      let bonusDriver = await db.setBonusDriver(req.body);
      res.send(bonusDriver);
      // send Data via WebSocket
      bonusDriver.type = "BonusDriver";
      aWss.clients.forEach(function (client) {
        client.send(JSON.stringify(bonusDriver));
      });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  })
  return router;
}