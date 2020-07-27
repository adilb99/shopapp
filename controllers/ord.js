const table = require('../db_apis/ord.js');
 
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


function getEntryFromRec(req) {
    // var new_entry = {
    // client_id : req.query.client_id,
    // cart_id: req.query.cart_id,  
    // create_date: req.query.create_date,
    // country: req.query.country,
    // state: req.query.state,
    // city: req.query.city,
    // street: req.query.street,
    // house: req.query.house,
    // zip: req.query.zip,
    // ord_status_id: req.query.ord_status_id
    // };

      const new_entry = {
        cart_id: req.body.cart_id,  
        country: req.body.country,
        province_state: req.body.province_state,
        city: req.body.city,
        street: req.body.street,
        house_no: req.body.house_no,
        zip: req.body.zip,
        };
   
    return new_entry;
  }
   
  async function post(req, res, next) {
    try {
      let new_entry = getEntryFromRec(req);
   
      new_entry = await table.create(new_entry);
   
      res.status(201).json(new_entry);
    } catch (err) {
      next(err);
    }
  }
   
  module.exports.post = post;

  function getEntryFromRec_put(req) {

      const new_entry = {
        ord_status_id: req.body.ord_status_id
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
