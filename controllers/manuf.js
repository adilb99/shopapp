const manuf= require('../db_apis/manuf.js');
 
async function get(req, res, next) {
  try {
    const context = {};
 
    context.id = parseInt(req.params.id, 10);
 
    const rows = await manuf.find(context);
 
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


function getManufFromRec(req) {
    // var new_manuf = {
    //   name: req.query.name,
    //   descr: req.query.descr,
    //   logourl: req.query.logourl
    // };

      const new_manuf = {
        name: req.body.name,
        descr: req.body.descr,
        logourl: req.body.logourl
        };

   
    return new_manuf;
  }
   
  async function post(req, res, next) {
    try {
      let new_manuf = getManufFromRec(req);
   
      new_manuf = await manuf.create(new_manuf);
   
      res.status(201).json(new_manuf);
    } catch (err) {
      next(err);
    }
  }
   
  module.exports.post = post;


  async function put(req, res, next) {
    try {
      let new_manuf = getManufFromRec(req);
   
      new_manuf.id = parseInt(req.query.id, 10);
      
      new_manuf = await manuf.update(new_manuf);
   
      if (new_manuf !== null) {
        res.status(200).json(new_manuf);
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
   
      const success = await manuf.delete(id);
   
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