const categ = require('../db_apis/categ.js');
 
async function get(req, res, next) {
  try {
    const context = {};
 
    context.id = parseInt(req.params.id, 10);
 
    const rows = await categ.find(context);
 
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


function getCategFromRec(req) {
    // var new_categ = {
    //   name: req.query.name,
    //   descr: req.query.descr
    // };
   
     const new_categ = {
        name: req.body.name,
        descr: req.body.descr
        };

    return new_categ;
  }
   
  async function post(req, res, next) {
    try {
      let new_categ = getCategFromRec(req);
   
      new_categ = await categ.create(new_categ);
   
      res.status(201).json(new_categ);
    } catch (err) {
      next(err);
    }
  }
   
  module.exports.post = post;


  async function put(req, res, next) {
    try {
      let new_categ = getCategFromRec(req);
   
      new_categ.id = parseInt(req.params.id, 10);
      
      new_categ = await categ.update(new_categ);
   
      if (new_categ !== null) {
        res.status(200).json(new_categ);
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
   
      const success = await categ.delete(id);
   
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