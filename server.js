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




app.post('/auth', async function(request, response, next) {

  	var username = request.body.username;
  	var password = request.body.password;
  	if (username && password) {

      try {
  		var results = await pool.query("SELECT * FROM users where username='"+username+"' and password='"+password+"'")
        console.log("ton pairneis");
  			if (results.length > 0) {
          const { password, ...userWithoutPassword } = results[0];
  				response.json(userWithoutPassword);
  			} else {
  				response.status(400).json({ message: 'Username or password is incorrect' })
  			}
  			response.end();

    } catch(err) {
        throw new Error(err)
    }
  	} else {

      response.status(400).json({ message: 'Please enter Username and Password!' })
  		response.end();
  	}


});

app.post('/getScholars', async function(request, response, next) {

  	var username = request.body.username;

  	if (username ) {

      try {
  		var results = await pool.query("SELECT * FROM Scholars where username='"+username+"'")
        console.log(results);
  			if (results.length > 0) {
          response.send(results);
  			} else {
  				response.status(400).json({ message: 'No Scholars' })
  			}
  			response.end();

    } catch(err) {
        throw new Error(err)
    }
  	} else {

      response.status(400).json({ message: 'Something went wrong' })
  		response.end();
  	}


});

app.post('/addScholar', async function(request, response, next) {

    	var title = request.body.title;
      var sector = request.body.sector;
      var level = request.body.level;
      var description = request.body.description;
      var username = request.body.username;


        try {
    		var results = await pool.query("INSERT INTO Scholars (name, tomeas, epipedo, Description, Username) VALUES ('"+title+"','"+sector+"','"+level+"','"+description+"','"+username+"')")
    			if (results.affectedRows > 0) {
            response.status(201).json({ message: 'successful' })
    			} else {
    				response.status(400).json({ message: 'unsuccessful' })
    			}
    			response.end();

        } catch(err) {
            throw new Error(err)
        }

});

app.post('/editScholar', async function(request, response, next) {

      var scholarID = request.body.ScholarID;
    	var title = request.body.title;
      var sector = request.body.sector;
      var level = request.body.level;
      var description = request.body.description;



        try {
    		var results = await pool.query("UPDATE Scholars SET name='"+title+"', tomeas='"+sector+"', epipedo='"+level+"', Description='"+description+"'  WHERE idScholars='"+scholarID+"'")
        
    			if (results.affectedRows > 0) {
            response.status(201).json({ message: 'successful' })
    			} else {
    				response.status(400).json({ message: 'unsuccessful' })
    			}
    			response.end();

        } catch(err) {
            throw new Error(err)
        }

});

app.post('/removeScholar', async function(request, response, next) {




        try {
    		var results = await pool.query("DELETE FROM Scholars WHERE idScholars='"+scholarID+"'")
    			if (results.affectedRows > 0) {
            response.status(201).json({ message: 'successful' })
    			} else {
    				response.status(400).json({ message: 'unsuccessful' })
    			}
    			response.end();

        } catch(err) {
            throw new Error(err)
        }

});

// use basic HTTP auth to secure the api
//app.use(basicAuth);

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
