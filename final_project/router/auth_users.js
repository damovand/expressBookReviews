const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const booklist = require('./booksdb.js');

const regd_users = express.Router();
let users = [];
let the_books = booklist;
//let reviewlist = the_books.reviews;


const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  console.log("validated user <",userswithsamename.length,">")
  return userswithsamename.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  console.log("authenticated user <",validusers.length,">")
  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
  //return res.status(300).json({message: "Yet to be implemented 22"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const new_review = req.query.review

    console.log(" the review <",new_review,">");

     let accessToken = req.session.authorization ;
     if ( accessToken.length == 0 )   {
        return res.status(403).json({message: "User is not logged in or authenticated"});
    }
    const username = accessToken.username;

    let values = Object.values(booklist[isbn].reviews);
    
    console.log(" The reivew object values  <",Object.values(booklist[isbn].reviews),">");
    
    let exists = Object.values(booklist[isbn].reviews).includes(username);
    
    console.log (" review for customer <",username,">",exists);
    
    if (exists === false) {
        Object.values(booklist[isbn].reviews).push({
                "reviewer":username,
                "review":new_review
            })
        console.log(" Added Review<",Object.values(booklist[isbn].reviews),">")
    }
    else {
            console.log("Update existing ");
    }
    //Check if the there is existing reviews for this book
   
  return res.status(300).json({message: "Yet to be implemented 23"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
