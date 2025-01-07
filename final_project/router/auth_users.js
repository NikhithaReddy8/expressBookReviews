const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  const user = users.find(u => u.username === username && u.password === password);
  return user ? true : false;
};

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const user = users.find(u => u.username === username);
  const token = jwt.sign({ username: user.username }, "your_jwt_secret_key", { expiresIn: '1h' });

  req.session.token = token;
  return res.status(200).json({ message: "Login successful", token });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const token = req.session.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, "your_jwt_secret_key", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    const book = books.find(b => b.isbn === isbn);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const existingReviewIndex = book.reviews.findIndex(r => r.username === user.username);
    if (existingReviewIndex !== -1) {
      book.reviews[existingReviewIndex].review = review;
    } else {
      book.reviews.push({ username: user.username, review });
    }

    return res.status(200).json({ message: "Review added/modified successfully" });
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const token = req.session.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, "your_jwt_secret_key", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    const book = books.find(b => b.isbn === isbn);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const reviewIndex = book.reviews.findIndex(r => r.username === user.username);
    if (reviewIndex === -1) {
      return res.status(404).json({ message: "Review not found" });
    }

    book.reviews.splice(reviewIndex, 1);
    return res.status(200).json({ message: "Review deleted successfully" });
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
