const express = require('express');
const path = require('path');
const app = express();

// Serve static files for the React SPA from the 'build' directory.
app.use('/app', express.static(path.join(__dirname, 'build')));

// Traditional multi-page routes (served from /public)
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'landing.html'))
);

app.get('/login', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'login.html'))
);

app.get('/admin', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'admin.html'))
);

// Redirect all /app routes to index.html, letting React handle routing
app.get('/app*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// (Optional) 404 fallback for unknown routes.  This should be after all other routes.
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);

