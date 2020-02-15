const express = require("express");
const Author = require("../models/author");
const Post = require("../models/post");

const authorsRouter = express.Router();

authorsRouter
  .get("/", (req, res) => {
    Author.find({})
      .exec()
      .then(data => {
        console.log(data);
        res.status(200).json({ authors: data });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Internal Server Error");
      });
  })
  .get("/:authorname", (req, res) => {
    const { authorname = "" } = req.params;
    Author.find({ _id: authorname })
      .populate("author", "_id firstName lastName")
      .exec()
      .then(data => {
        console.log(data);
        const [authorData = {}] = data;
        console.log(authorData);
        const { firstName, lastName } = authorData;
        const authorNameCombine = firstName + " " + lastName;
        console.log(authorNameCombine);
        Post.find({ author: authorNameCombine })
          .exec()
          .then(postData => {
            console.log(postData);
            res.status(200).json({ author: postData });
          })
          .catch(err => {
            console.error(err);
            res.status(500).send("Internal Server Error");
          });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Internal Server Error");
      });
  });

module.exports = authorsRouter;
