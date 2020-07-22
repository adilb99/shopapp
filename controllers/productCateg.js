const table = require('../db_apis/productCateg.js');
 
async function get(req, res, next) {
  try {
    const context = {};
 
    context.categ_id = parseInt(req.params.categ_id, 10);
 
    const rows = await table.find(context);
 
    if (req.params.categ_id) {
      if (rows) {
        res.status(200).json(rows);
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
