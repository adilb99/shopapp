const oracledb = require('oracledb');
const dbConfig = require('../config/database.js');
 
// oracledb.initOracleClient({configDir: '/opt/oracle/instantclient_19_6/network/admin'});

async function initialize() {
  const pool = await oracledb.createPool(dbConfig.hrPool);
}
 
module.exports.initialize = initialize;

async function close() {
  
  const pl = oracledb.getPool();
  await pl.close();
  
}
 
module.exports.close = close;

function simpleExecute(statement, binds = [], opts = {}) {
  return new Promise(async (resolve, reject) => {
    let conn;
 
    opts.outFormat = oracledb.OBJECT;
    opts.autoCommit = true;
 
    try {
      conn = await oracledb.getConnection();
 
      const result = await conn.execute(statement, binds, opts);
      
      resolve(result);

    } catch (err) {
      reject(err);
    } finally {
      if (conn) { // conn assignment worked, need to close
        try {
          
          await conn.close();
          
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
}
 
module.exports.simpleExecute = simpleExecute;