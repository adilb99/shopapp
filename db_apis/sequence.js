const database = require('../services/database.js');
const oracledb = require('oracledb');




const baseQuery = "select last_number from user_sequences";
 
async function find(context) {
  let query = baseQuery;
  const binds = {};
  if (context.sequence_name) {
    binds.sequence_name = context.sequence_name;
    
    query += " where sequence_name = :sequence_name";
  }
 
  const result = await database.simpleExecute(query, binds);
 
  return result.rows;
}
 
module.exports.find = find;