const database = require('../services/database.js');
const oracledb = require('oracledb');




const baseQuery = "select * from ord";
 
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



const createSql = `
    BEGIN
        new_order_byID(:client_id, :cart_id, to_timestamp(:create_date, 'yyyy/mm/dd hh24:mi:ss'), :country, :state, :city, :street, :house, :zip, :ord_status_id);
    END;
    `;
 
async function create(emp) {
  const new_order = Object.assign({}, emp);
    console.log(new_order);


//   new_client.id = {
//     dir: oracledb.BIND_OUT,
//     type: oracledb.INTEGER
//   }
 
  const result = await database.simpleExecute(createSql, new_order);
 
//   new_client.id = result.outBinds.id[0];
 
  return new_order;
}
 
module.exports.create = create;

const updateSql =
 `
 DECLARE
    addr_id integer;
 BEGIN
    
    select address_id into addr_id from ord where id = :id;

    update address
    set country = :country,
        province_state = :state,
        city = :city,
        street = :street,
        house_no = :house,
        zip = :zip
        where id = addr_id;
   
    update ord
    set ord_status_id = :ord_status_id
    where id = :id;

 END;`;
 
async function update(emp) {
  const new_review = Object.assign({}, emp);
  console.log(new_review);
  const result = await database.simpleExecute(updateSql, new_review);
 
  if (result != null) {
    return new_review;
  } else {
    return null;
  }
}
 
module.exports.update = update;
