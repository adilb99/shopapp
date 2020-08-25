const database = require('../services/database.js');
const oracledb = require('oracledb');




const baseQuery = "select * from cart_history";
 
async function find(context) {
  let query = baseQuery;
  const binds = {};
 
  if (context.id) {
    binds.id = context.id;
 
    query += " where id = :id";
  }

  if (context.client_id) {
    binds.client_id = context.client_id;

    if(query.includes('where')){
      query += ' and client_id = :client_id';
    } else {
      query += ' where client_id = :client_id';
    }
  }

  if (context.cart_status_id) {
    binds.cart_status_id = context.cart_status_id;

    if(query.includes('where')){
      query += ' and cart_status_id = :cart_status_id';
    } else {
      query += ' where cart_status_id = :cart_status_id';
    }
  }
 
  const result = await database.simpleExecute(query, binds);
 
  return result.rows;
}
 
module.exports.find = find;


/*

const procedure_new_cart = `
    BEGIN
        new_cart_byID(:client_id, to_timestamp(:create_date, 'yyyy/mm/dd hh24:mi:ss'), :cart_status_id);
    END;
    `;
 
async function create(emp) {
  const new_cart = Object.assign({}, emp);
    console.log(new_cart);

 
  const result = await database.simpleExecute(procedure_new_cart, new_cart);
 
 
  return new_cart;
}
 
module.exports.create = create;





const updateSql =
 `BEGIN
    
    UPDATE cart_history

 END;`;


async function update(emp) {
  const new_cart = Object.assign({}, emp);
  console.log(new_cart);
  const result = await database.simpleExecute(updateSql, new_cart);
 
  if (result.rowsAffected && result.rowsAffected === 1) {
    return new_cart;
  } else {
    return null;
  }
}
 
module.exports.update = update;

*/


const deleteSql =
 `begin

    delete from ord_item where cart_content_history_id in (select id from cart_content_history where cart_history_id = :id);

    delete from ord where cart_history_id = :id;

    delete from cart_content_history where cart_history_id = :id;

    delete from cart_history
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