const database = require('../services/database.js');
const oracledb = require('oracledb');




const baseQuery = "select * from client";
 
async function find(context) {
  let query = baseQuery;
  const binds = {};
 
  if (context.login) {
    binds.login = context.login;
 
    query += " where login = :login";
  }
 
  const result = await database.simpleExecute(query, binds);
 
  return result.rows;
}
 
module.exports.find = find;