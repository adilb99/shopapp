const database = require('../services/database.js');
const oracledb = require('oracledb');




const baseQuery = "select * from categ";
 
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



const procedure_new_categ = `
    BEGIN
        new_categ(:name, :descr, :id);
    END;
    `;
 
async function create(emp) {
  const new_categ = Object.assign({}, emp);
    console.log(new_categ);


  new_categ.id = {
    dir: oracledb.BIND_OUT,
    type: oracledb.INTEGER
  }
 
  const result = await database.simpleExecute(procedure_new_categ, new_categ);
 
  new_categ.id = result.outBinds.id;
 
  return new_categ;
}
 
module.exports.create = create;

const updateSql =
 `update categ
  set name = :name,
    descr = :descr
  where id = :id`;
 
async function update(emp) {
  const new_categ = Object.assign({}, emp);
  console.log(new_categ);
  const result = await database.simpleExecute(updateSql, new_categ);
 
  if (result.rowsAffected && result.rowsAffected === 1) {
    return new_categ;
  } else {
    return null;
  }
}
 
module.exports.update = update;

const deleteSql =
 `begin

    update product set categ_id = (select id from categ where name = 'other') where categ_id = :id;
    
    delete from categ
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