const table = require('../db_apis/clientLogin.js');
 
async function get(req, res, next) {
  try {
    const context = {};
 
    context.login = req.params.login;
 
    const rows = await table.find(context);
 
    if (req.params.login) {
      if (rows.length === 1) {
        res.status(200).json(rows[0]);
      } else {
        res.status(404).end();
      }
    } else {
      res.status(200).json(rows);
    }
  } catch (err) {
    next(err);
  }
}
 
module.exports.get = get;
