const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const serverless = require("serverless-http");
const router = express.Router();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://tinas:wcKxFJufg3L6dW4n@cluster0.jn3tu.mongodb.net/Feedback?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("App is running");
});

// Feedback Schema
const FeedbackSchema = new mongoose.Schema({
  npsResponse: Number,
  textResponse: String,
});

const Feedback = mongoose.model("Feedback", FeedbackSchema);

// POST route to store feedback
app.post("/provideApiResource", (req, res) => {
  const { npsResponse, textResponse } = req.body;

  const newFeedback = new Feedback({
    npsResponse,
    textResponse,
  });

  newFeedback
    .save()
    .then(() => {
      res.status(200).json({ message: "Response submitted successfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to save feedback" });
    });
});

app.use("/.netlify/functions/app", router);
module.exports.handler = serverless(app);
