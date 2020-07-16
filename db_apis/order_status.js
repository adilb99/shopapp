const database = require('../services/database.js');
const oracledb = require('oracledb');




const baseQuery = "select * from order_status";
 
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
        INSERT INTO order_status VALUES (seq_order_status.NEXTVAL, :name);
    END;
    `;
 
async function create(emp) {
  const new_status = Object.assign({}, emp);
    console.log(new_status);


//   new_client.id = {
//     dir: oracledb.BIND_OUT,
//     type: oracledb.INTEGER
//   }
 
  const result = await database.simpleExecute(createSql, new_status);
 
//   new_client.id = result.outBinds.id[0];
 
  return new_status;
}
 
module.exports.create = create;

const updateSql =
 `BEGIN
  
  if :name != 'unknown' then
    UPDATE order_status SET name = :name WHERE id = :id;
  end if;

 END;`;
 
async function update(emp) {
  const new_status = Object.assign({}, emp);
  console.log(new_status);
  const result = await database.simpleExecute(updateSql, new_status);
 
  if (result.rowsAffected && result.rowsAffected === 1) {
    return new_status;
  } else {
    return null;
  }
}
 
module.exports.update = update;

const deleteSql =
 `
 begin
 
 if (select name from order_status where id = :id) != 'unknown' then
    UPDATE ord SET ord_status_id = (SELECT id FROM order_status WHERE name = 'unknown') WHERE ord_status_id = :id;

    DELETE FROM order_status WHERE id = :id;

    :rowcount := sql%rowcount;
 end if;
 
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