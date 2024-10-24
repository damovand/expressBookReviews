const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const booklist = require('./booksdb.js');

const public_users = express.Router();


// Function to check if the user exists
const doesExist = (the_username) => {
     
    let userswithsamename = users.filter((the_username) => {
        for (let i = 0; i < users.length; i++) {
            
            if (users[i] === the_username) {
                console.log("Compare  the existing users  <" ,users[i].username,">","<",the_username.username,">");
                return users[i].username ;
            }
        }
        console.log("  No match found ")
    });
   console.log("userwithsamename <",userswithsamename,">")
  return userswithsamename.length > 0;
};


public_users.post("/register", (req,res) => {
  //Write your code here
  //*  Note! The following extraction of values worked testingin Postman only after 
  //   I typed in the username and password as JSON entires manually! 
  const username = req.body.username;
  const password = req.body.password;
    //console.log(" Username: [", username,"]");
    //console.log(" Userpassword: [", password,"]");
  
  if (username ) {
    
    if (!doesExist(username)) {

      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. ${username} Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists! " });
    }
  } 
  return res.status(404).json({message: "Something Went Wrong - Unable to register user"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
 
  //res.send(JSON.stringify({books}, null, 4));
    res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  
    let isbn = parseInt(req.params.isbn);
       // Filter the users array to find users whose lastName matches the extracted lastName parameter
    isbn-=1;
    let the_book = booklist[isbn];
        // Send the filtered_lastname array as the response to the client
   
    console.log("  The Review Found ", the_book);
    res.send(the_book);
    //return res.status(300).json({message: "Yet to be implemented 3 ", the_book });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

    const author = req.params.author;

  // Filter the users array to find users whose lastName matches the extracted lastName parameter
  const the_book = booklist.find(item=>item.author === author);
    // Send the filtered_lastname array as the response to the client
  res.send(the_book);
  //return res.status(300).json({message: "Yet to be implemented 4 ", the_book });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  
    const title = req.params.title;
    const the_book = booklist.find(item=>item.title === title);
    res.send(the_book);
  //return res.status(300).json({message: "Yet to be implemented 5"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
   
    let book_index = parseInt(req.params.isbn);
    console.log(req.params)
  // Filter the users array to find users whose lastName matches the extracted lastName parameter
    book_index -=1;
    let the_book = booklist[book_index];
    let the_reviews = the_book.reviews;
    console.log("  The Review Found ", the_reviews );
    res.send(the_reviews);
 // return res.status(300).json({message: "Yet to be implemented 6 ",the_book});
});

module.exports.general = public_users;

