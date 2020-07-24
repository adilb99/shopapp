const database = require('../services/database.js');
const oracledb = require('oracledb');




const baseQuery = "select * from cart";
 
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



const procedure_new_cart = `
    BEGIN
        :create_date := systimestamp;
        new_cart_byID(:client_id, :create_date, :id, :cart_status_id);
    END;
    `;
 
async function create(emp) {
  const new_cart = Object.assign({}, emp);

  new_cart.id = {
    dir: oracledb.BIND_OUT,
    type: oracledb.INTEGER
  }

  new_cart.create_date = {
    dir: oracledb.BIND_OUT,
    type: oracledb.DB_TYPE_TIMESTAMP
  }

  new_cart.cart_status_id = {
    dir: oracledb.BIND_OUT,
    type: oracledb.INTEGER
  }
 
  const result = await database.simpleExecute(procedure_new_cart, new_cart);
 
  new_cart.id = result.outBinds.id;
  new_cart.create_date = result.outBinds.create_date;
  new_cart.cart_status_id = result.outBinds.cart_status_id;
 
  return new_cart;
}
 
module.exports.create = create;

// const updateSql =
//  `update cart
//   set client_id = :client_id,
//     create_date = to_timestamp(:create_date, 'yyyy/mm/dd hh24:mi:ss'),
//     cart_status_id = :cart_status_id
//   where id = :id`;
 
const updateSql =
 `BEGIN
    cancel_cart_byID(:id);
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

const deleteSql =
 `begin

    delete from cart_content where cart_id = :id;

    delete from cart
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