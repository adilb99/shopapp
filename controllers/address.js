const table = require('../db_apis/address.js');
 
async function get(req, res, next) {
  try {
    const context = {};
 
    context.id = parseInt(req.params.id, 10);
 
    const rows = await table.find(context);
 
    if (req.params.id) {
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

function getEntryFromRec_put(req) {
    const new_entry = {
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      street: req.body.street,
      house: req.body.house,
      zip: req.body.zip
      };
 
  return new_entry;
}

async function put(req, res, next) {
  try {
    let new_entry = getEntryFromRec_put(req);
 
    new_entry.id = parseInt(req.params.id, 10);
    
    new_entry = await table.update(new_entry);
 
    if (new_entry !== null) {
      res.status(200).json(new_entry);
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
}
 
module.exports.put = put;