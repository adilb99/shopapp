const database = require('../services/database.js');
const oracledb = require('oracledb');




const baseQuery = "select * from product_image";
 
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



const procedure_new_image = `
    BEGIN
        INSERT INTO product_image VALUES (seq_product_image.NEXTVAL, :url, :product_id);
    END;
    `;
 
async function create(emp) {
  const new_image = Object.assign({}, emp);
    console.log(new_image);


//   new_client.id = {
//     dir: oracledb.BIND_OUT,
//     type: oracledb.INTEGER
//   }
 
  const result = await database.simpleExecute(procedure_new_image, new_image);
 
//   new_client.id = result.outBinds.id[0];
 
  return new_image;
}
 
module.exports.create = create;

const updateSql =
 `update product_image
  set url = :url,
    product_id = :product_id
  where id = :id`;
 
async function update(emp) {
  const new_image = Object.assign({}, emp);
  console.log(new_image);
  const result = await database.simpleExecute(updateSql, new_image);
 
  if (result.rowsAffected && result.rowsAffected === 1) {
    return new_image;
  } else {
    return null;
  }
}
 
module.exports.update = update;

const deleteSql =
 `begin

    
    delete from product_image
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