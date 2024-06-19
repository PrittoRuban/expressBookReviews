const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const userExists = users.some((user) => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  res.status(201).json({ message: "User registered successfully" });
});

public_users.get("/", function (req, res) {
  res.json({ books: JSON.stringify(books) });
});

public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.keys(books)
    .filter((isbn) => books[isbn].author === author)
    .map((isbn) => books[isbn]);

  if (booksByAuthor.length > 0) {
    res.json(booksByAuthor);
  } else {
    res.status(404).json({ message: "No books found by this author" });
  }
});

public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.keys(books)
    .filter((isbn) => books[isbn].title === title)
    .map((isbn) => books[isbn]);

  if (booksByTitle.length > 0) {
    res.json(booksByTitle);
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

public_users.get("/books", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:3000/");
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching books list:", error);
    res
      .status(500)
      .json({ message: "Error fetching books list", error: error.message });
  }
});

public_users.get("/books/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:3000/isbn/${isbn}`);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching book by ISBN (${isbn}):`, error);
    res
      .status(500)
      .json({
        message: `Error fetching book by ISBN (${isbn})`,
        error: error.message,
      });
  }
});

public_users.get("/books/author/:author", async (req, res) => {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:3000/author/${author}`);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching books by author (${author}):`, error);
    res
      .status(500)
      .json({
        message: `Error fetching books by author (${author})`,
        error: error.message,
      });
  }
});

public_users.get("/books/title/:title", async (req, res) => {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:3000/title/${title}`);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching books by title (${title}):`, error);
    res
      .status(500)
      .json({
        message: `Error fetching books by title (${title})`,
        error: error.message,
      });
  }
});

module.exports.general = public_users;
