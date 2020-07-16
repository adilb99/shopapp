var oracledb = require('oracledb');

oracledb.getConnection({
      user: "system",
      password: "oracle",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST   = 192.168.99.100)(PORT = 49161))(CONNECT_DATA =(SID = xe)(SERVER = DEDICATED)))"
}, function(err, connection) {
if (err) {
    console.error(err.message);
    return;
}
     connection.execute("select * from product where id = (select product_id from (select sum(quantity), product_id from cart_content_history group by product_id order by sum(quantity) desc) where ROWNUM = 1)",[], function(err, result) {
    if (err) { console.error(err.message);
          doRelease(connection);
          return;
     }
     console.log(result.metaData);
     console.log(result.rows);
     doRelease(connection);
   });
});

function doRelease(connection) {
       connection.release(function(err) {
         if (err) {
          console.error(err.message);
        }
      }
   );
}



