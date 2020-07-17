const product = require('../db_apis/product.js');
 
async function get(req, res, next) {
  try {
    const context = {};
 
    context.id = parseInt(req.params.id, 10);
 
    const rows = await product.find(context);
 
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


function getProductFromRec(req) {
    // var new_product = {
    //   name: req.query.name,
    //   price: req.query.price,
    //   descr: req.query.descr,
    //   spec: req.query.spec,
    //   stock_num: req.query.stock_num,
    //   url: req.query.url,
    //   categ_id: req.query.categ_id,
    //   manuf_id: req.query.manuf_id,
    //   rating: req.query.rating,
    //   is_active: req.query.is_active
    // };

     const new_product = {
        name: req.body.name,
        price: req.body.price,
        descr: req.body.descr,
        spec: req.body.spec,
        stock_num: req.body.stock_num,
        url: req.body.url,
        categ_id: req.body.categ_id,
        manuf_id: req.body.manuf_id,
        rating: req.body.rating,
        is_active: req.body.is_active
        };
    
    return new_product;
  }
   
  async function post(req, res, next) {
    try {
      let new_product = getProductFromRec(req);
      new_product = await product.create(new_product);
   
      res.status(201).json(new_product);
    } catch (err) {
      next(err);
    }
  }
   
  module.exports.post = post;


  async function put(req, res, next) {
    try {
      let new_product = getProductFromRec(req);
   
      new_product.id = parseInt(req.query.id, 10);
      
      new_product = await product.update(new_product);
   
      if (new_product !== null) {
        res.status(200).json(new_product);
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
   
      const success = await product.delete(id);
   
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