const express = require('express');
const path = require('path');
const app = express();

const distPath = path.join(__dirname, '../dist');

// Serve static files from the 'dist' directory
app.use(express.static(distPath));

// Any route - fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const port = process.env.PORT ?? 8002;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
