const morgan = require('morgan');
const http = require('http');
const express = require('express');
const webServerConfig = require('../config/web-server.js');
const database = require('./database.js'); 
const router = require('./router.js');
const bodyParser = require('body-parser');

let httpServer;
 
function initialize() {
  return new Promise((resolve, reject) => {
    const app = express();
    httpServer = http.createServer(app);
 
    app.use(morgan('combined'));
    
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    app.use(function(req, res, next){
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    })

    app.use('/api', router);
    app.get('/', async (req, res) => {
      const result = await database.simpleExecute('select name from product');
      const output = result.rows[0].name;
      res.end(`test query result: ${output}`);

    });
    

    httpServer.listen(webServerConfig.port)
      .on('listening', () => {
        console.log(`Web server listening on 192.168.99.100:${webServerConfig.port}`);
        // module.exports.httpServer = httpServer;
        resolve();
      })
      .on('error', err => {
        reject(err);
      });
  });
}
 
module.exports.initialize = initialize;


function close() {
  return new Promise((resolve, reject) => {
    httpServer.close((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}
 
module.exports.close = close;

