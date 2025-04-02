const express = require('express');
const { getTopUsers, getTopPosts } = require('./socialService');

const app = express();
const PORT = 9877;

app.get('/users', async (req, res) => {
  try {
    const topUsers = await getTopUsers();
    res.status(200).json(topUsers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch top users." });
  }
});

app.get('/posts', async (req, res) => {
  const { type } = req.query;
  
  if (!['popular', 'latest'].includes(type)) {
    return res.status(400).json({ error: "Invalid type. Use 'popular' or 'latest'." });
  }

  try {
    const posts = await getTopPosts(type);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});