const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Atlas connected'))
  .catch((err) => console.log(err));

// Feedback Schema
const FeedbackSchema = new mongoose.Schema({
  npsResponse: Number,
  textResponse: String,
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);

// POST route to store feedback
app.post('/provideApiResource', (req, res) => {
  const { npsResponse, textResponse } = req.body;

  const newFeedback = new Feedback({
    npsResponse,
    textResponse,
  });

  newFeedback.save()
    .then(() => {
      res.status(200).json({ message: 'Response submitted successfully' });
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to save feedback' });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
