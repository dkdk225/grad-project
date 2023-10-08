const { Router } = require("express");
const update = Router({
  caseSensitive: true,
});

update.post('/', async (req, res) => {
  console.log(req.body)
  res.sendStatus(200)
})

module.exports = update;
