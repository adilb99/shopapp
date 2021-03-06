const table = require('../db_apis/cart_content_history.js');
 
async function get(req, res, next) {
  try {
    const context = {};
 
    context.id = parseInt(req.params.id, 10);

    context.cart_id = parseInt(req.query.cart_id, 10);
 
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

/*
function getEntryFromRec(req) {
    const new_entry = {
      quantity: req.query.quantity,
      product_id: req.query.product_id,
      cart_history_id: req.query.cart_history_id,
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


  async function put(req, res, next) {
    try {
      let new_entry = getEntryFromRec(req);
   
      new_entry.id = parseInt(req.query.id, 10);
      
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


  */

  async function del(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
   
      const success = await table.delete(id);
   
      if (success) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    } catch (err) {
      next(err);
    }
  }
   
  module.exports.delete = del;