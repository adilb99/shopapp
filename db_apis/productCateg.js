const database = require('../services/database.js');
const oracledb = require('oracledb');




const baseQuery = "select * from product";
 
async function find(context) {
  let query = baseQuery;
  const binds = {};
 
  if (context.categ_id) {
    binds.categ_id = context.categ_id;
 
    query += " where categ_id = :categ_id";
  }
 
  const result = await database.simpleExecute(query, binds);
 
  return result.rows;
}
 
module.exports.find = find;