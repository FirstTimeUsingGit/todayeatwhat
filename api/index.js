const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'FirstTimeUsingGit';
const REPO_NAME = 'todayeatwhat';

// 獲取 data.json
app.get('/data', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/data.json`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
    );
    const decodedContent = Buffer.from(response.data.content, 'base64').toString();
    res.json(JSON.parse(decodedContent));
  } catch (error) {
    res.status(500).json({ error: '獲取數據失敗' });
  }
});

// 更新 data.json
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
    res.status(500).json({ error: '保存數據失敗' });
  }
});

module.exports = app;