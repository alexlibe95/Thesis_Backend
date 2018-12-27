require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const mariadb = require('mariadb');
const bodyParser = require('body-parser');
const basicAuth = require('_helpers/basic-auth');
const errorHandler = require('_helpers/error-handler');

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})


const pool  = mariadb.createPool({
  host : '83.212.98.13',
  user : 'alex',
  password : 'uDWHxaEQ12',
  database : 'ScholarshipsDB',
  connectionLimit: 5
});


// use basic HTTP auth to secure the api
app.use(basicAuth);

// api routes
app.use('/users', require('./users/users.controller'));

// global error handler
app.use(errorHandler);


app.use('/all', function(req, res, next) {
  console.log('Request Url: 192.168.1.3:4000'+req.url);
  let conn;
  pool.getConnection()
  .then(conn =>{
    conn.query("SELECT * from Scholars")
    .then((rows)=>{
      console.log(rows);
      res.send(rows);
    })
    .then((res)=>{
      console.log(res);
      conn.end();
    })
    .catch(err=>{
      conn.end();
    })
  })
  .catch(err=>{

  });
});

app.use('/:id', function(req, res, next) {
  console.log('Request Url: 192.168.1.g13:4000'+req.url);
  let conn;
  pool.getConnection()
  .then(conn =>{
    conn.query("SELECT * from Scholars where id="+req.params.id)
    .then((rows)=>{
      console.log(rows);
      res.send(rows);
    })
    .then((res)=>{
      console.log(res);
      conn.end();
    })
    .catch(err=>{
      conn.end();
    })
  })
  .catch(err=>{

  });

});

// start server
const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
