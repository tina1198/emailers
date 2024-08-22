const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const serverless = require("serverless-http");
const cors = require("cors");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/api", (req, res) => {
  res.send("App is running");
});

// Connect to MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://tinas:wcKxFJufg3L6dW4n@cluster0.jn3tu.mongodb.net/Feedback?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => console.log(err));

// Feedback Schema
const FeedbackSchema = new mongoose.Schema({
  npsResponse: Number,
  textResponse: String,
});

const Feedback = mongoose.model("Feedback", FeedbackSchema);

// POST route to store feedback
app.post("/api/provideApiResource", (req, res) => {
  const { npsResponse, textResponse } = req.body;

  const newFeedback = new Feedback({
    npsResponse,
    textResponse,
  });

  newFeedback
    .save()
    .then(() => {
      res.status(200).json({ status: 'success'});
    })
    .catch((err) => {
      res.status(500).json({status: 'error' });
    });
});

// You must export your app for serverless functions
module.exports.handler = serverless(app);
