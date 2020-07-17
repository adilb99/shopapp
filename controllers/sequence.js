const table = require('../db_apis/sequence.js');
 
async function get(req, res, next) {
  try {
    const context = {};
 
    context.sequence_name = req.params.sequence_name;

    const rows = await table.find(context);
 
    if (req.params.sequence_name) {
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