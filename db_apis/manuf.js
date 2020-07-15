const database = require('../services/database.js');
const oracledb = require('oracledb');




const baseQuery = "select * from manufacturer";
 
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



const procedure_new_manuf = `
    BEGIN
        new_manuf(:name, :descr, :logourl);
    END;
    `;
 
async function create(emp) {
  const new_manuf = Object.assign({}, emp);
    console.log(new_manuf);


//   new_client.id = {
//     dir: oracledb.BIND_OUT,
//     type: oracledb.INTEGER
//   }
 
  const result = await database.simpleExecute(procedure_new_manuf, new_manuf);
 
//   new_client.id = result.outBinds.id[0];
 
  return new_manuf;
}
 
module.exports.create = create;

const updateSql =
 `update manufacturer
  set name = :name,
    descr = :descr,
    logo_url = :logourl
  where id = :id`;
 
async function update(emp) {
  const new_manuf = Object.assign({}, emp);
  console.log(new_manuf);
  const result = await database.simpleExecute(updateSql, new_manuf);
 
  if (result.rowsAffected && result.rowsAffected === 1) {
    return new_manuf;
  } else {
    return null;
  }
}
 
module.exports.update = update;

const deleteSql =
 `begin

    update product set manufacturer_id = (select id from manufacturer where name = 'Unknown') where manufacturer_id = :id;
    
    delete from manufacturer
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