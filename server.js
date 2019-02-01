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
  	var passwordHash = request.body.password;
  	if (username && passwordHash) {

      try {
  		var results = await pool.query("SELECT * FROM users where username='"+username+"' and password='"+passwordHash+"'")
  			if (results.length > 0) {
          if(results[0].Activated){
          const { passwordHash, ...userWithoutPassword } = results[0];
  				response.json(userWithoutPassword);
        }else{
          response.status(400).json({ message: 'Your profile has not been Activated yet!' })
        }
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

app.post('/salt', async function(request, response, next) {

  	var username = request.body.username;

  	if (username ) {

      try {
  		var results = await pool.query("SELECT salt FROM users where username='"+username+"'")
  			if (results.length > 0) {
          response.send(results);
  			} else {
  				response.status(400).json({ message: 'Invalid Username' })
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

app.post('/register', async function(request, response, next) {

    var instName = request.body.instName;
    var instLink = request.body.instLink;
    var firstName = request.body.firstName;
    var lastName = request.body.lastName;
  	var username = request.body.username;
  	var passwordHash = request.body.passwordHash;
    var salt = request.body.salt;

  	if ( instName && instLink && firstName && lastName && username && passwordHash && salt) {

      try {
  		var results = await pool.query("INSERT INTO users (username, password, firstName, lastName, instName, instLink, salt) VALUES ('"+username+"','"+passwordHash+"','"+firstName+"','"+lastName+"','"+instName+"','"+instLink+"','"+salt+"')")
  			if (results.affectedRows > 0) {
          response.status(201).json({ message: 'Successful registration' })
  			} else {
  				response.status(400).json({ message: 'Username or password is incorrect' })
  			}
  			response.end();

    } catch(err) {
        throw new Error(err)
    }
  	} else {

      response.status(400).json({ message: 'Please fill the form!' })
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
      var euro = request.body.euro;
      var origin = request.body.origin;
      var duration = request.body.duration;
      var age_from = request.body.age_from;
      var age_until = request.body.age_until;
      var indigent = request.body.indigent;
      var comment = request.body.comment;
      var date_expire = request.body.date_expire;
      var username = request.body.username;


        try {
    		var results = await pool.query("INSERT INTO Scholars (title, sector, level, euro, origin, duration, age_from, age_until, indigent, comment, date_expire, username) VALUES ('"+title+"','"+sector+"','"+level+"','"+euro+"','"+origin+"','"+duration+"','"+age_from+"','"+age_until+"','"+indigent+"','"+comment+"','"+date_expire+"','"+username+"')")
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
      var euro = request.body.euro;
      var origin = request.body.origin;
      var duration = request.body.duration;
      var age_from = request.body.age_from;
      var age_until = request.body.age_until;
      var indigent = request.body.indigent;
      var comment = request.body.comment;
      var date_expire = request.body.date_expire;



        try {
    		var results = await pool.query("UPDATE Scholars SET title='"+title+"', sector='"+sector+"', level='"+level+"', euro='"+euro+"', origin='"+origin+"', duration='"+duration+"', age_from='"+age_from+"', age_until='"+age_until+"', indigent='"+indigent+"', comment='"+comment+"', date_expire='"+date_expire+"'  WHERE id='"+scholarID+"'")

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

        var scholarID = request.body.ScholarID;


        try {
    		var results = await pool.query("DELETE FROM Scholars WHERE id='"+scholarID+"'")
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

// start server
const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
