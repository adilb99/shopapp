const client = require('../db_apis/client.js');
 
async function get(req, res, next) {
  try {
    const context = {};
 
    context.id = parseInt(req.params.id, 10);
 
    const rows = await client.find(context);
 
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


function getClientFromRec(req) {
    const new_client = {
      first_name: req.query.first_name,
      second_name: req.query.second_name,
      email: req.query.email,
      phone_num: req.query.phone_num,
      birth_date: req.query.birth_date,
      login: req.query.login,
      pass: req.query.pass
    };
   
    return new_client;
  }
   
  async function post(req, res, next) {
    try {
      let new_client = getClientFromRec(req);
   
      new_client = await client.create(new_client);
   
      res.status(201).json(new_client);
    } catch (err) {
      next(err);
    }
  }
   
  module.exports.post = post;


  async function put(req, res, next) {
    try {
      let new_client = getClientFromRec(req);
   
      new_client.id = parseInt(req.query.id, 10);
      
      new_client = await client.update(new_client);
   
      if (new_client !== null) {
        res.status(200).json(new_client);
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
   
      const success = await client.delete(id);
   
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