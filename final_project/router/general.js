const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
let booklist = Object.values(books);

// Function to check if the user exists
const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return res.status(333).json({ message: " in doesExist User examining [" , username});
  //return userswithsamename.length > 0;
};


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  console.log(" User: [", req.body,"]");
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists! " });
    }
  }
  
  return res.status(404).json({ message: "Unable to register user.[", username  } );
 // return res.status(300).json({message: "Yet to be implemented 1"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
 // return res.status(300).json({message: "Yet to be implemented 2"});
  //res.send(JSON.stringify({books}, null, 4));
    res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    //let booklist = Object.values(books);
    let isbn = parseInt(req.params.isbn);
       // Filter the users array to find users whose lastName matches the extracted lastName parameter
    isbn-=1;
    let the_book = booklist[isbn];
        // Send the filtered_lastname array as the response to the client
    res.send(the_book);

    //return res.status(300).json({message: "Yet to be implemented 3 ", the_book });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  
  //let booklist = Object.values(books);
    const author = req.params.author;
    console.log(" author: [", req.params,"]");
  // Filter the users array to find users whose lastName matches the extracted lastName parameter
  const the_book = booklist.find(item=>item.author === author);
    // Send the filtered_lastname array as the response to the client
  res.send(the_book);
  //return res.status(300).json({message: "Yet to be implemented 4 ", the_book });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  //let booklist = Object.values(books);
    const title = req.params.title;
    const the_book = booklist.find(item=>item.title === title);
    res.send(the_book);
  //return res.status(300).json({message: "Yet to be implemented 5"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    //let booklist = Object.values(books);
    let book_index = parseInt(req.params.isbn);
    console.log(req.params)
  // Filter the users array to find users whose lastName matches the extracted lastName parameter
    book_index -=1;
    let the_book = booklist[book_index];
    //let the review = the_book;
    res.send(the_book);
 // return res.status(300).json({message: "Yet to be implemented 6 ",the_book});
});

module.exports.general = public_users;
