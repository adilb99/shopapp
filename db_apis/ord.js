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

  if(context.client_id) {
    binds.client_id = context.client_id;

    if(query.includes('where')) {
      query += ' and client_id = :client_id';
    } else {
      query += ' where client_id = :client_id';
    }
  }

  if(context.cart_history_id) {
    binds.cart_history_id = context.cart_history_id;

    if(query.includes('where')) {
      query += ' and cart_history_id = :cart_history_id';
    } else {
      query += ' where cart_history_id = :cart_history_id';
    }
  }

  if(context.ord_status_id) {
    binds.ord_status_id = context.ord_status_id;

    if(query.includes('where')) {
      query += ' and ord_status_id = :ord_status_id';
    } else {
      query += ' where ord_status_id = :ord_status_id';
    }
  }
 
  const result = await database.simpleExecute(query, binds);
 
  return result.rows;
}
 
module.exports.find = find;



const createSql = `
    BEGIN
        :create_date := systimestamp;
        new_order_byID(:cart_id, :create_date, :country, :province_state, :city, :street, :house_no, :zip, :address_id, :id, :ord_status_id, :client_id, :bill);
    END;
    `;
 
async function create(emp) {
  const new_order = Object.assign({}, emp);
  


  new_order.id = {
    dir: oracledb.BIND_OUT,
    type: oracledb.INTEGER
  };

  new_order.ord_status_id = {
    dir: oracledb.BIND_OUT,
    type: oracledb.INTEGER
  };

  new_order.address_id = {
    dir: oracledb.BIND_OUT,
    type: oracledb.INTEGER
  };

  new_order.client_id = {
    dir: oracledb.BIND_OUT,
    type: oracledb.INTEGER
  }

  new_order.bill = {
    dir: oracledb.BIND_OUT,
    type: oracledb.INTEGER
  }

  new_order.create_date = {
    dir: oracledb.BIND_OUT,
    type: oracledb.DB_TYPE_TIMESTAMP
  }
 
  const result = await database.simpleExecute(createSql, new_order);
 
  new_order.id = result.outBinds.id;
  new_order.address_id = result.outBinds.address_id;
  new_order.ord_status_id = result.outBinds.ord_status_id;
  new_order.client_id = result.outBinds.client_id;
  new_order.bill = result.outBinds.bill;
  new_order.create_date = result.outBinds.create_date;
  new_order.cart_history_id = new_order.cart_id;

  delete new_order.cart_id;
  delete new_order.country;
  delete new_order.province_state;
  delete new_order.city;
  delete new_order.street;
  delete new_order.house_no;
  delete new_order.zip;
 
  return new_order;
}
 
module.exports.create = create;

const updateSql =
 `
 BEGIN
    
    update ord
    set ord_status_id = :ord_status_id
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
