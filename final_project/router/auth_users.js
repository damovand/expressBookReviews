const fs = require('fs');
const express = require('express');
const jwt = require('jsonwebtoken');
const booklist = require('./booksdb.js');
let books = require('./booksdb.js');



function saveBooks(){
    console.log (" Save the review for book ");
    fs.writeFileSync('./booksdb.json', JSON.stringify(books, null, 2),'utf-8');
    console.log( " Done ! Saved The Review <",books,">");
}
function loadBooks() {
    const data = fs.readFileSync('./booksdb.json', 'utf8');
    return JSON.parse(data);
}   
const regd_users = express.Router();
let users = [];
let the_books = booklist;

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
    const review = req.query.review
    
    
    console.log(" the review <",review,">");
    const username = req.session.authorization.username;
    
    //console.log ("===== Update / insert a review for user ",username)
   
   // console.log(" ++++ Books<",books,">")  ;
    let the_book = books[isbn-1];
    
    if (!the_book)
        return res.status(404).json({ message: "Book not found" });

    the_book.reviews.reviewer = username;
    the_book.reviews.review = review;  // Update or add review
   
   
    saveBooks();  // Save changes to file
        return res.status(200).json({ message: "Review added/updated" });
  
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    updated_books = loadBooks();
    let the_book = updated_books[isbn-1];
    console.log (" Find and delete a review from <", the_book.reviews, ">by user <",username,">" );
    console.log ("the reviewer name is <",the_book.reviews.reviewer,">");

    // confirm the book exists
    if (!the_book)
        return res.status(404).json({ message: "Book not found" });
    if (the_book.reviews.reviewer ===username){
        delete the_book.reviews.reviewer;
        saveBooks();  // Save changes to file
        return res.status(200).json({ message: {"Deleted Review Posted By ":username} });
    }
    else {return res.status(300).json({message: "A review by this user for the book Not Found!"});}
    
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
