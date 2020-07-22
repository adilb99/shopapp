const database = require('../services/database.js');
const oracledb = require('oracledb');




const baseQuery = "select * from review";
 
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
        new_review_byID(:client_id, :product_id, :rating, :title, :text);
    END;
    `;
 
async function create(emp) {
  const new_review = Object.assign({}, emp);
    console.log(new_review);


//   new_client.id = {
//     dir: oracledb.BIND_OUT,
//     type: oracledb.INTEGER
//   }
 
  const result = await database.simpleExecute(createSql, new_review);
 
//   new_client.id = result.outBinds.id[0];
 
  return new_review;
}
 
module.exports.create = create;

const updateSql =
 `
 DECLARE
 pr_id integer;
 BEGIN

  SELECT product_id into pr_id from review where id = :id;

    update review
    set rating = :rating,
        title = :title,
        text = :text
        where id = :id;

    UPDATE product 
    SET rating = (SELECT SUM(rating) FROM review WHERE product_id = pr_id) / (SELECT COUNT(rating) FROM review WHERE product_id = pr_id) 
    WHERE id = pr_id;

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

const deleteSql =
 `
 declare
 pr_id integer;
 begin
    
    select product_id into pr_id from review where id = :id; 

    delete from review
    where id = :id;

    UPDATE product 
    SET rating = (SELECT SUM(rating) FROM review WHERE product_id = pr_id) / (SELECT COUNT(rating) FROM review WHERE product_id = pr_id) 
    WHERE id = pr_id;

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