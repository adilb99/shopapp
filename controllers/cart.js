const cart = require('../db_apis/cart.js');
 
async function get(req, res, next) {
  try {
    const context = {};
 
    context.id = parseInt(req.params.id, 10);
 
    const rows = await cart.find(context);
 
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


function getCartFromRec(req) {
    const new_cart = {
      client_id: req.query.client_id,
      create_date: req.query.create_date,
      cart_status_id: req.query.cart_status_id
    };
   
    return new_cart;
  }
   
  async function post(req, res, next) {
    try {
      let new_cart = getCartFromRec(req);
   
      new_cart = await cart.create(new_cart);
   
      res.status(201).json(new_cart);
    } catch (err) {
      next(err);
    }
  }
   
  module.exports.post = post;


  async function put(req, res, next) {
    try {
      let new_cart = getCartFromRec(req);
   
      new_cart.id = parseInt(req.query.id, 10);
      
      new_cart = await cart.update(new_cart);
   
      if (new_cart !== null) {
        res.status(200).json(new_cart);
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
      const id = parseInt(req.query.id, 10);
   
      const success = await cart.delete(id);
   
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