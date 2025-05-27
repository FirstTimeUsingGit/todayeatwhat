const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Configure CORS to allow requests from the frontend
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests from the frontend (case-insensitive) and its subpaths
    const allowedOrigin = 'https://firsttimeusinggit.github.io';
    if (!origin || origin.toLowerCase().startsWith(allowedOrigin.toLowerCase())) {
      callback(null, origin || '*');
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'FirstTimeUsingGit';
const REPO_NAME = 'todayeatwhat';

// Root endpoint to verify API is running
app.get('/', (req, res) => {
  res.json({ status: 'API is running' });
});

// Fetch data.json
app.get('/data', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/data.json`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
    );
    const decodedContent = Buffer.from(response.data.content, 'base64').toString();
    res.json(JSON.parse(decodedContent));
  } catch (error) {
    console.error('Error fetching data:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Update data.json
app.post('/data', async (req, res) => {
  try {
    const { ingredients, recipes } = req.body;
    const jsonData = { ingredients, recipes };
    const content = Buffer.from(JSON.stringify(jsonData)).toString('base64');
    const response = await axios.get(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/data.json`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
    );
    await axios.put(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/data.json`,
      {
        message: 'Update data.json',
        content,
        sha: response.data.sha,
      },
      { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving data:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    if (error.response?.status === 409) {
      res.status(409).json({ error: 'Data conflict, please retry' });
    } else {
      res.status(500).json({ error: 'Failed to save data' });
    }
  }
});

module.exports = app;