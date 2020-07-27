const database = require('../services/database.js');
const oracledb = require('oracledb');




const baseQuery = "select * from client";
 
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



const procedure_new_client = `
    BEGIN
        :standard_date := to_date(:birth_date, 'yyyy/mm/dd');
        new_client(:first_name, :second_name, :login, :pass, :email, :phone_num, to_date(:birth_date, 'yyyy/mm/dd'), :id);
    END;
    `;
 
async function create(emp) {
  const new_client = Object.assign({}, emp);
  

  new_client.id = {
    dir: oracledb.BIND_OUT,
    type: oracledb.NUMBER
  };

  new_client.standard_date = {
    dir: oracledb.BIND_OUT,
    type: oracledb.DB_TYPE_DATE
  }
 
  const result = await database.simpleExecute(procedure_new_client, new_client);
 
  new_client.id = result.outBinds.id;
  new_client.birth_date = result.outBinds.standard_date;

  delete new_client.standard_date;

  console.log(new_client);
 
  return new_client;
}
 
module.exports.create = create;

const updateSql =
 `BEGIN

 :new_date := to_date(:birth_date, 'yyyy/mm/dd');

 update client
  set first_name = :first_name,
    second_name = :second_name,
    email = :email,
    phone_num = :phone_num,
    birth_date = to_date(:birth_date, 'yyyy/mm/dd'),
    login = :login,
    pass = :pass
  where id = :id;
  
  END;`;
 
async function update(emp) {
  const new_client = Object.assign({}, emp);
  
  new_client.new_date = {
    dir: oracledb.BIND_OUT,
    type: oracledb.DB_TYPE_DATE
  }

  const result = await database.simpleExecute(updateSql, new_client);
 
  new_client.birth_date = result.outBinds.new_date;
  delete new_client.new_date;


  if (result) {
    return new_client;
  } else {
    return null;
  }
}
 
module.exports.update = update;

const deleteSql =
 `begin

    delete from review where client_id = :id;
    delete from ord_item where ord_id in (select id from ord where client_id = :id);
    delete from ord where client_id = :id;
    delete from cart_content_history where cart_history_id in (select id from cart_history where client_id = :id);
    delete from cart_history where client_id = :id;
    delete from cart_content where cart_id in (select id from cart where client_id = :id);
    delete from cart where client_id = :id;
    delete from client
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