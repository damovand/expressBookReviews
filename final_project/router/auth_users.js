const fs = require('fs');
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();
let users = [];

function saveBooks(){
    console.log (" Save the review for book ");
    fs.writeFileSync('./booksdb.json', JSON.stringify(books, null, 2),'utf-8');
    console.log( " Done ! Saved The Review <",books,">");
}
function loadBooks() {
    const data = fs.readFileSync('./booksdb.json', 'utf8');
    return JSON.parse(data);
}   
//saveBooks();

const isValid = (username)=>{               //returns boolean
    let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  console.log("validated user <",userswithsamename.length,">")
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validuser = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  console.log("authenticated user <",validuser.length,">")
  if(validuser.length > 0){
    return true;
  } else {
    return false;
  }
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
    let accessToken = jwt.sign({ data: password },
        'access', 
        { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review
    
    console.log(" the review <",review,">");
    
    const username = req.session.authorization.username;
    let the_book = books[isbn];
    
    if (!the_book)
        return res.status(404).json({ message: "Book not found" });

    the_book.reviews.reviewer = username;
    the_book.reviews.review = review;  // Update or add review
   
   
    saveBooks();  // Save changes to file
        return res.status(200).json({ message: "Review added/updated" });
  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    //const username = req.session.authorization.username;
    reviewer = req.session.authorization['username']
    updated_books = loadBooks();
    let filtered_review = updated_books[isbn]["reviews"];
    console.log (" Find and delete a review from <", filtered_review.reviewer, ">by user <",reviewer,">" );
    if (filtered_review.reviewer){
        delete filtered_review[reviewer];
        res.send(`Reviews for the ISBN  ${isbn} posted by the user ${reviewer} deleted.`);
    }
    else{
        res.send("Can't delete, as this review has been posted by a different user");
    }
    
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
