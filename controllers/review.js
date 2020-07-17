const table = require('../db_apis/review.js');
 
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
    //   product_id: req.query.product_id,
    //   client_id: req.query.client_id,
    //   rating: req.query.rating,
    //   title: req.query.title,
    //   text: req.query.text
    // };

      const new_entry = {
        product_id: req.body.product_id,
        client_id: req.body.client_id,
        rating: req.body.rating,
        title: req.body.title,
        text: req.body.text
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