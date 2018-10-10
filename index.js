//var sqlite3 = require('sqlite3').verbose();
//var db = new sqlite3.Database('data/watestDB.db');

var express=require("express");
var session=require('express-session');
var fileUpload = require('express-fileupload');
var bodyParser = require('body-parser');

var cookieParser=require('cookie-parser');
var db =require("./db");
var passport = require('passport')
var LocalStrategy= require('passport-local').Strategy;
//var FacebookStrategy = require('passport-facebook').Strategy;

var jwt = require('jsonwebtoken');
var app=express();
var cors = require('cors');

///date
var now = new Date();
var day = ("0" + now.getDate()).slice(-2);
var month = ("0" + (now.getMonth() + 1)).slice(-2);
var today = now.getFullYear() + "-" + (month) + "-" + (day);

console.log(today)
///date end

app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(cookieParser());
app.use(session({ resave: true, saveUninitialized: true, 
    secret: 'uwotm8' }))

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
    next();
});
passport.use(new LocalStrategy
    (

    //{usernameField: 'user',passwordField: 'pass'},
    //login method
    function (usernameField, passwordField, done) 
    {
        db.get('SELECT * FROM usersTbl WHERE userEmail=? AND userPassword =?',usernameField,passwordField, function(err, user)
        {
            if (!user)
            {
                return done(null, false);
            } 
           
      return done(null, user);
        });
       
    }
)
);

passport.serializeUser(function (user, done) {
    return done(null, user.id);
});
passport.deserializeUser(function (id, done) {
 
    db.get('SELECT * FROM usersTbl WHERE id = ?', id, function(err, user) {
        if (!user) 
        {
            return done(null, false);
        }
        else
        {
            return done(null, user);
        }
        
      });
 
});
app.post('/registeruser', function(req, res) {
  if(req.body.userName==='' || req.body.userEmail==='' || req.body.password==='')
  {
    console.log("Dont");
    res.send("Don't do it");
  }
  else
  {
    db.get('select * from usersTbl where userN=? OR userEmail=?',req.body.userName,req.body.userEmail,function(err,row){
        if(row)
        {
             res.send("User Name or Email already exists");    
        }
        else
        {
            db.run('INSERT INTO usersTbl(userN,userEmail,userPassword) VALUES(?,?,?)',req.body.userName,req.body.userEmail,req.body.password);
            res.send("Welcome");
            console.log("welcome");
            
        }  
    });
  }
});
app.post('/user', verifyToken, (req, res) => {  
    jwt.verify(req.token, 'necro', (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
        authData.token=req.token
        res.json({
          
          authData
         
        });
      }
    });
  });
  
  app.post('/createpost', verifyToken, (req, res) => {  
    jwt.verify(req.token, 'necro', (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
        if (!req.files)
        {
            db.run('INSERT INTO blogPosts(userId,blogHeader,blogContent,isPublic,attach,removed,blogCDate,blogUDate,comment) VALUES(?,?,?,?,?,?,?,?,?)',authData.id,req.body.blogHeader,req.body.blogContent,req.body.isPublic,null,req.body.removed,today,today,req.body.comment)
            res.send(" Post Creted Without file")
        }
          //return res.status(400).send('No files were uploaded.');
          
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        else
        {
            var sampleFile = req.files.sampleFile;
       
            // Use the mv() method to place the file somewhere on your server
            sampleFile.mv('uploads/'+today+"-"+authData.id+"-"+sampleFile.name, function(err) {
              if (err)
                return res.status(500).send(err);
                db.run('INSERT INTO blogPosts(userId,blogHeader,blogContent,isPublic,attach,removed,blogCDate,blogUDate,comment) VALUES(?,?,?,?,?,?,?,?,?)',authData.id,req.body.blogHeader,req.body.blogContent,req.body.isPublic,authData.id+"-"+sampleFile.name,req.body.removed,today,today,req.body.comment)
              res.send('File uploaded!');
              console.log(sampleFile.name);
            });
        }
    }
    });
  });
  
  app.post('/counterpost', verifyToken, (req, res) => {  
    jwt.verify(req.token, 'necro', (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
        db.get("SELECT count(*) as countPost FROM blogPosts WHERE userId ='"+authData.id+"' and removed='false'", function(err, row) {  
       
            res.json(row);
            
           
         });
         //res.sendStatus(200);
    }
    });
  });
  app.post('/myposts', verifyToken, (req, res) => {  
    jwt.verify(req.token, 'necro', (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
        db.all("SELECT blogHeader,blogID,blogContent,isPublic,attach,comment  FROM blogPosts WHERE removed='false' and userId ='"+authData.id+"'", function(err, row) {  
       
            res.json({myposts:row});
            
           
         });
         //res.sendStatus(200);
    }
    });
  });
  app.post('/updateposts', verifyToken, (req, res) => {  
    jwt.verify(req.token, 'necro', (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
          
        db.run("UPDATE blogPosts  SET blogHeader ='" +req.body.blogHeader+"', blogContent='"+ req.body.blogContent+"',blogUDate='"+ today+"',isPublic='"+req.body.isPublic +"',removed='"+req.body.removed +"',comment='"+req.body.comment+"' WHERE  blogId='"+req.body.blogId +"'",function(err){
              if (err)
              {
                  return console.error(err.message);
                }
                console.log(`Row(s) updated: ${this.changes}`);
               
                res.send(`Row(s) updated: ${this.changes}`+"- by "+ authData.userN);
                
            });
        }
    });
});
app.post('/postspublic', verifyToken, (req, res) => {  
    jwt.verify(req.token, 'necro', (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
          
        var sql="SELECT blogPosts.comment,blogPosts.blogHeader,blogPosts.blogContent,blogPosts.blogId,usersTbl.userN,blogPosts.userId FROM blogPosts INNER JOIN usersTbl ON usersTbl.id = blogPosts.userId where blogPosts.isPublic='true' and blogPosts.removed='false'";
    db.all(sql,function(err, row) {  
        if(row.length===0)
        {
            res.send('There is no Public Posts');
        }
        else
        {
            res.json({publicPosts:row});
        }
        
    });
        }
    });
});
app.post('/createcomment', verifyToken, (req, res) => {  
    jwt.verify(req.token, 'necro', (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
       
        db.run('INSERT INTO comments(blogID,isPublic,commentText,removed,commentDate,commenterID,blogOwnerID) VALUES(?,?,?,?,?,?,?)',req.body.blogId,req.body.commentPublic,req.body.commentText,req.body.commentRemoved,today,authData.id,req.body.blogOwnerID)
        res.send("Commented");
        
    }
    });
  });
  app.post('/comments', verifyToken, (req, res) => {  
    jwt.verify(req.token, 'necro', (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
       
        var sql="SELECT comments.*,usersTbl.userN FROM comments INNER JOIN usersTbl ON usersTbl.id = comments.commenterID where comments.blogID="+req.body.blogID+" and comments.removed='false'";
    db.all(sql,function(err, row) {  
        
        if(row.length===0)
        {
            res.send('There is no Comments');
        }
        else
        {
            res.json({Comments:row});
        }
        
    });
        
    }
    });
  });
  app.post('/updatecomments', verifyToken, (req, res) => {  
    jwt.verify(req.token, 'necro', (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
       
        db.run("UPDATE comments  SET commentText ='" +req.body.commentText+"', isPublic='"+ req.body.isPublic+"',removed='"+ req.body.removed+"' WHERE  commentID='"+req.body.commentID +"'",function(err){
            if (err)
            {
                return console.error(err.message);
              }
              console.log(`Row(s) updated: ${this.changes}`);
             
              res.send(`Row(s) updated: ${this.changes}`+"- by "+ authData.userN);
              
          });
        
    }
    });
  });
  /*
  app.post('/upload', function(req, res) {
    if (!req.files)
    {
        db.run('INSERT INTO blogPosts(userId,blogHeader,blogContent,isPublic,attach,removed,blogCDate,blogUDate) VALUES(?,?,?,?,?,?,?,?)',1,req.body.blogHeader,req.body.blogContent,req.body.isPublic,null,req.body.removed,today,today)
        res.send("Without file")
    }
      //return res.status(400).send('No files were uploaded.');
      
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    else
    {
        var sampleFile = req.files.sampleFile;
   
        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv('uploads/'+today+"-"+sampleFile.name, function(err) {
          if (err)
            return res.status(500).send(err);
            db.run('INSERT INTO blogPosts(userId,blogHeader,blogContent,isPublic,attach,removed,blogCDate,blogUDate) VALUES(?,?,?,?,?,?,?,?)',1,req.body.blogHeader,req.body.blogContent,req.body.isPublic,sampleFile.name,req.body.removed,today,today)
          res.send('File uploaded!');
          console.log(sampleFile.name);
        });
    }
    
  });*/
  var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him/her to the login page
    res.status(401).send("Please Log IN");
    
};
app.post('/login', passport.authenticate('local', {session: false}),
 function (req, res)
 {
     if(isAuthenticated)
    {
        
        // expiring token /*
         jwt.sign(req.user, 'necro',/*{ expiresIn: '30s' },*/ function(err, token)  {
            var userToken=token;
            req.user.token=token;

            res.json({
              token           
            });
            
            req.user.token=userToken;
            console.log(userToken)
          });
          
    }
    else
    {
            res.sendStatus(403);
    }
});
app.post('/logout', verifyToken, (req, res) => {  
    jwt.verify(req.token, 'necro', (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
        if(isAuthenticated)
{
    console.log(authData.userN+ " cikis yaptı");
    
    res.send(authData.userN + " by");
}
req.session.destroy();
req.logOut();
         //res.sendStatus(200);
    }
    });
  });

 function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
      // Split at the space
      const bearer = bearerHeader.split(' ');
      // Get token from array
      const bearerToken = bearer[1];
      // Set the token
      req.token = bearerToken;
      // Next middleware
      next();
    } else {
      // Forbidden
      res.sendStatus(403);
    }
  
  }
 app.listen(1337);