const database = require('../services/database.js');
const oracledb = require('oracledb');




const baseQuery = "select * from cart_content_history";
 
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


/*
const procedure_new_content = `
    BEGIN
        INSERT INTO cart_content_history VALUES ();
    END;
    `;
 
async function create(emp) {
  const new_content = Object.assign({}, emp);
    console.log(new_content);


//   new_client.id = {
//     dir: oracledb.BIND_OUT,
//     type: oracledb.INTEGER
//   }
 
  const result = await database.simpleExecute(procedure_new_content, new_content);
 
//   new_client.id = result.outBinds.id[0];
 
  return new_content;
}
 
module.exports.create = create;

const updateSql =
 `update cart_content
  set quantity = :quantity,
    product_id = :product_id,
    cart_id = :cart_id
  where id = :id`;
 
async function update(emp) {
  const new_content = Object.assign({}, emp);
  console.log(new_content);
  const result = await database.simpleExecute(updateSql, new_content);
 
  if (result.rowsAffected && result.rowsAffected === 1) {
    return new_content;
  } else {
    return null;
  }
}
 
module.exports.update = update;


*/

const deleteSql =
 `begin

    delete from ord_item where cart_content_history_id = :id;

    delete from cart_content_history
    where id = :id;

    :rowcount := sql%rowcount;
 
  end;`
 
async function del(id) {
  const binds = {
    id: id,
    rowcount: {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER
    }
  }
  const result = await database.simpleExecute(deleteSql, binds);
 
  return result.outBinds.rowcount === 1;
}
 
module.exports.delete = del;