const pr_image = require('../db_apis/pr_image.js');
 
async function get(req, res, next) {
  try {
    const context = {};
 
    context.id = parseInt(req.params.id, 10);
 
    const rows = await pr_image.find(context);
 
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


function getImageFromRec(req) {
    // var new_image = {
    //   url: req.query.url,
    //   product_id: req.query.product_id
    // };

      const new_image = {
        url: req.body.url,
        product_id: req.body.product_id
        };
   
    return new_image;
  }
   
  async function post(req, res, next) {
    try {
      let new_image = getImageFromRec(req);
   
      new_image = await pr_image.create(new_image);
   
      res.status(201).json(new_image);
    } catch (err) {
      next(err);
    }
  }
   
  module.exports.post = post;


  async function put(req, res, next) {
    try {
      let new_image = getImageFromRec(req);
   
      new_image.id = parseInt(req.params.id, 10);
      
      new_image = await pr_image.update(new_image);
   
      if (new_image !== null) {
        res.status(200).json(new_image);
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
   
      const success = await pr_image.delete(id);
   
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