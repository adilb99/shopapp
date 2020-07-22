const database = require('../services/database.js');
const oracledb = require('oracledb');




const baseQuery = "select * from address";
 
async function find(context) {
  let query = baseQuery;
  const binds = {};
 
  if (context.id) {
    binds.id = context.id;
 
    query += " where id = :id";
  }
 
  const result = await database.simpleExecute(query, binds);
 
  return result.rows;
}
 
module.exports.find = find;

const updateSql =
 `
 BEGIN
    
    update address
    set country = :country,
        province_state = :state,
        city = :city,
        street = :street,
        house_no = :house,
        zip = :zip
        where id = :id;
   
 END;`;
 
async function update(emp) {
  const new_review = Object.assign({}, emp);
  console.log(new_review);
  const result = await database.simpleExecute(updateSql, new_review);
 
  if (result) {
    return new_review;
  } else {
    return null;
  }
}
 
module.exports.update = update;
