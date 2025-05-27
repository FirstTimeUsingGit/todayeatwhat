const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Configure CORS to allow requests from the frontend
app.use(cors({
  origin: 'https://FirstTimeUsingGit.github.io',
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
    console.error('Error fetching data:', error.message);
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
    console.error('Error saving data:', error.message);
    if (error.response?.status === 409) {
      res.status(409).json({ error: 'Data conflict, please retry' });
    } else {
      res.status(500).json({ error: 'Failed to save data' });
    }
  }
});

module.exports = app;