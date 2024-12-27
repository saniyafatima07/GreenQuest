const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { fetchLocations, saveLocation } = require('./server'); // SQL functions

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public', 'css')));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'frontend', 'views'));

// Routes

// Serve static leaflet map
app.get('/map', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'leaflet.html'));
});

// Home route (Dynamic EJS)
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/login', (req, res) => {
  res.render('login');
});

// In-charge page
app.get('/incharge', (req, res) => {
  res.render('incharge');
});

// About page
app.get('/about', (req, res) => {
  res.render('about');
});


// API endpoint to fetch locations
app.get('/api/locations', (req, res) => {
  fetchLocations((err, results) => {
    if (err) {
      console.error('Error fetching locations:', err);
      res.status(500).json({ error: 'Database query failed' });
    } else {
      res.json(results);
    }
  });
});

// API endpoint to save a new location
app.post('/api/locations', (req, res) => {
  const { name, latitude, longitude } = req.body;

  if (!name || !latitude || !longitude) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  saveLocation(name, latitude, longitude, (err) => {
    if (err) {
      console.error('Error saving location:', err);
      res.status(500).json({ error: 'Failed to save location' });
    } else {
      res.json({ message: 'Location saved successfully' });
    }
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
