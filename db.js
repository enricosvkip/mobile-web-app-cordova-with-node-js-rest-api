
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/watestDB.db');

    
    
    db.serialize(function () {
        //db.run("CREATE TABLE IF NOT EXISTS counts (key TEXT, value INTEGER)");
        db.run("CREATE TABLE IF NOT EXISTS blogPosts ( `blogId` INTEGER PRIMARY KEY AUTOINCREMENT, `userId` INTEGER, `blogHeader` TEXT, `blogContent` TEXT, `isPublic` TEXT, `attach` TEXT, `removed` TEXT, `blogCDate` TEXT, `blogUDate` TEXT, `comment` TEXT )");
        db.run("CREATE TABLE IF NOT EXISTS comments ( `commentID` INTEGER PRIMARY KEY AUTOINCREMENT, `blogID` INTEGER, `isPublic` INTEGER, `commentText` TEXT, `removed` INTEGER, `commentDate` TEXT, `commenterID` INTEGER, `blogOwnerID` INTEGER )");
        db.run("CREATE TABLE IF NOT EXISTS usersTbl ( `userId` INTEGER PRIMARY KEY AUTOINCREMENT, `userN` TEXT NOT NULL, `userEmail` TEXT NOT NULL, `userPassword` BLOB NOT NULL )");
       /*  db.run("INSERT INTO counts (key, value) VALUES (?, ?)", "counter", 0);*/
        //db.run("UPDATE counts SET value = value + 1 WHERE key = ?", "counter");
    });

module.exports=db;