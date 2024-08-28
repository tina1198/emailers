const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const serverless = require("serverless-http");
const cors = require("cors");

const app = express();

// CORS options to allow specific origins and handle preflight requests
const corsOptions = {
  origin: 'https://amp.gmail.dev', // Specify the allowed origin (AMP playground in your case)
  methods: ['GET', 'POST', 'OPTIONS'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
  credentials: true // If dealing with credentials
};

// Apply CORS middleware with the options
app.use(cors(corsOptions));

// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test route to ensure app is running
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
  res.set('Access-Control-Allow-Origin', 'https://amp.gmail.dev'); // Ensure CORS headers are set

  const { npsResponse, textResponse } = req.body;

  const newFeedback = new Feedback({
    npsResponse,
    textResponse,
  });

  newFeedback
    .save()
    .then(() => {
      res.status(200).json({ npsResponse, textResponse });
    })
    .catch((err) => {
      res.status(500).json({ status: 'error' });
    });
});

// Handle preflight requests
app.options("/api/provideApiResource", cors(corsOptions));

// Export the app for serverless functions
module.exports.handler = serverless(app);
