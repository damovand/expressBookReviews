const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const booklist = require('./booksdb.js');
//const {books,saveBooks} = require('./booksdb.js');

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
     const username = req.session.authorization.username;

    /*----------------------------------------------------------------------
     if ( accessToken.length == 0 )   {
        return res.status(403).json({message: "User is not logged in or authenticated"});
    } */
    /*   This code works but we can get username directly from session as shown above
    const username = accessToken.username;  
    -----------------------------------------------------------------------*/

    /* ------- This entire code is not necessary --------------------------*/
    /*  We can access the information directly from books                  */
    /*  It doesn't matter that it is not an array                          */
    /* The commented code worked but it updated the info in memory         */
    /*---------------------------------------------------------------------*/
    
    /* let values = Object.values(booklist[isbn].reviews);
    let exists = Object.values(booklist[isbn].reviews).includes(username);
    if (exists === false) {
        Object.values(booklist[isbn].reviews).push({
                "reviewer":username,
                "review":new_review
            })  
        console.log(" Added Review<",Object.values(booklist[isbn].reviews),">")
    }
    else {
            console.log("Update existing ");
    } */

    let the_book = books[isbn];
    
    if (!the_book)
        return res.status(404).json({ message: "Book not found" });
    the_book.reviews[username] = new_review;  // Update or add review
  //  saveBooks();  // Save changes to file
        return res.status(200).json({ message: "Review added/updated" });
  
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
/*
    let the_book = books[isbn];
    // confirm the book exists
    if (!the_book)
        return res.status(404).json({ message: "Book not found" });
    if (the_book.reviews[username]===username){
        books[isbn].delete(reviews);
        saveBooks();  // Save changes to file
        return res.status(200).json({ message: "Review for user deleted" });
    }*/
    return res.status(300).json({message: "Yet to be implemented 72"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
