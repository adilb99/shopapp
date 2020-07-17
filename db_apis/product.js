const database = require('../services/database.js');
const oracledb = require('oracledb');




const baseQuery = "select * from product";
 
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



const procedure_new_product = `
    BEGIN
        new_product(:name, :price, :descr, :spec, :stock_num, :url, :manufacturer_id, :categ_id, :is_active, :rating);
    END;
    `;



async function create(emp) {
  const new_product = Object.assign({}, emp);
    


//   new_product.id = {
//     dir: oracledb.BIND_OUT,
//     type: oracledb.INTEGER
//   }

  console.log(new_product);

  const result = await database.simpleExecute(procedure_new_product, new_product);
 
//   new_product.id = result.outBinds.id[0];
 
  return new_product;
}
 
module.exports.create = create;

const updateSql =
 `update product
  set name = :name,
      price = :price,
      descr = :descr,
      spec = :spec,
      stock_num = :stock_num,
      url = :url,
      categ_id = :categ_id,
      rating = :rating,
      manufacturer_id = :manufacturer_id,
      is_active = :is_active
  where id = :id`;
 
async function update(emp) {
  const new_product = Object.assign({}, emp);
  console.log(new_product);
  const result = await database.simpleExecute(updateSql, new_product);
 
  if (result.rowsAffected && result.rowsAffected === 1) {
    return new_product;
  } else {
    return null;
  }
}
 
module.exports.update = update;

const deleteSql =
 `begin
  
    delete from ord_item where cart_content_history_id in (select id from cart_content_history where product_id = :id);
    delete from product_image where product_id = :id;
    delete from cart_content where product_id = :id;
    delete from cart_content_history where product_id = :id;
    delete from review where product_id = :id;




    delete from product
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