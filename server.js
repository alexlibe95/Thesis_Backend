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
  	var passwordHash = request.body.passwordHash;
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

app.post('/changepass', async function(request, response, next) {

  	var username = request.body.username;
    var passwordHash = request.body.passwordHash;
    var salt = request.body.salt;


  	if (username && passwordHash && salt) {

      try {
  		var results = await pool.query("UPDATE users SET password='"+passwordHash+"', salt='"+salt+"'WHERE username='"+username+"'")
  			if (results.affectedRows > 0) {
          response.send(results);
  			} else {
  				response.status(400).json({ message: 'Could not update Password' })
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

        try{
      		var results = await pool.query("SELECT * FROM users where username='"+username+"'")
      			if (results.length > 0) {
              response.status(400).json({ message: 'This Username has already account' })
      			} else {
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

      			}
      			response.end();

        }catch(err) {
            throw new Error(err)
        }


  	} else {

      response.status(400).json({ message: 'Please fill the form!' })
  		response.end();
  	}
});

app.post('/getProfScholars', async function(request, response, next) {

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
      var link = request.body.link;
      var username = request.body.username;

      if(indigent){
        indigent="1";
      }else{
        indigent="0";
      }

        try {
    		var results = await pool.query("INSERT INTO Scholars (title, sector, level, euro, origin, duration, age_from, age_until, indigent, comment, date_expire, link, username) VALUES ('"+title+"','"+sector+"','"+level+"','"+euro+"','"+origin+"','"+duration+"','"+age_from+"','"+age_until+"','"+indigent+"','"+comment+"','"+date_expire+"','"+link+"','"+username+"')")
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

app.use('/getAllScholars', function(req, res, next) {
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

app.post('/getScholars', async function(request, response, next) {

  	var sector = request.body.sector;
    var level = request.body.level;
    var euro = request.body.euro;
    var origin = request.body.origin;
    var age = request.body.age;
    var indigent = request.body.indigent;
    var active = request.body.active;

    if(indigent && active){
      indigent=1;
      active=1;
    }else if(indigent && !active){
      indigent=1;
      active=0;
    }else if(!indigent && !active){
      indigent=0;
      active=0;
    }else{
      indigent=0;
      active=1;
    }

    var list1=[];
    list1[0]=sector;
    list1[1]=level;
    list1[2]=origin;
    list1[3]=euro;
    list1[4]=age;

    var list2=[];
    list2[0]="sector=";
    list2[1]="level=";
    list2[2]="origin=";



    var expression="SELECT * FROM Scholars where ";
    console.log(expression)
    for(var i=0; i<3; i++){
      if(list1[i]!="all"){
        expression=expression+list2[i]+'"'+list1[i]+'" and ';
      }
    }
    if(list1[3]!="all"){
      if(list1[3]=="0"){
        expression=expression+'euro>"0" and euro<"501" and ';
      }else if(list1[3]=="500"){
        expression=expression+'euro>"500" and euro<"1501" and ';
      }else if(list1[3]=="1500"){
        expression=expression+'euro>"1500" and euro<"3001" and ';
      }else{
        expression=expression+'euro>"3000" and ';
      }
    }

    if(list1[4]!=""){
      expression=expression+"age_from<"+'"'+age+'" and age_until>'+'"'+age+'" and ';
    }
    expression=expression+"indigent="+'"'+indigent+'"';
    console.log(expression)

  	if (sector) {

      try {
  		var results = await pool.query(expression)
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


// start server
const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
