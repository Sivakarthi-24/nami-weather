// server.js — Express backend proxy for OpenWeatherMap API
// Keeps API key secure on the server side

require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENWEATHER_API_KEY;
const OWM_BASE = 'https://api.openweathermap.org/data/2.5';

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Simple in-memory cache (city → { data, timestamp }) ─────────────────────
const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// ─── Validate API key on startup ──────────────────────────────────────────────
if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
  console.warn('\n⚠️  WARNING: OpenWeatherMap API key is not configured!');
  console.warn('   Open the .env file and replace YOUR_API_KEY_HERE with your actual API key.');
  console.warn('   Get a free key at: https://openweathermap.org/api\n');
}

// ─── Helper: fetch with error handling ───────────────────────────────────────
async function owmFetch(endpoint, params) {
  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
    const err = new Error('OpenWeatherMap API key is missing or invalid.');
    err.status = 401;
    throw err;
  }

  const url = new URL(`${OWM_BASE}/${endpoint}`);
  url.searchParams.set('appid', API_KEY);
  url.searchParams.set('units', 'metric');
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.set(k, String(v));
    }
  });

  let res;
  try {
    res = await fetch(url.toString());
  } catch (networkErr) {
    const err = new Error('Unable to reach the OpenWeatherMap API.');
    err.status = 503;
    throw err;
  }

  let json;
  try {
    json = await res.json();
  } catch {
    const err = new Error('OpenWeatherMap returned an invalid response.');
    err.status = res.status || 502;
    throw err;
  }

  if (!res.ok) {
    const err = new Error(json.message || `OWM error ${res.status}`);
    err.status = res.status;
    err.owmCode = json.cod;
    throw err;
  }
  return json;
}

// ─── Route: Current Weather by city name ─────────────────────────────────────
app.get('/api/weather', async (req, res) => {
  const city = (req.query.city || '').trim();
  if (!city) return res.status(400).json({ error: 'City name is required.' });

  const cacheKey = `weather:${city.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json({ ...cached, cached: true });

  try {
    const data = await owmFetch('weather', { q: city });
    setCache(cacheKey, data);
    res.json(data);
  } catch (err) {
    const status = err.status === 404 ? 404 : err.status === 401 ? 401 : 500;
    res.status(status).json({ error: err.message, code: err.owmCode || status });
  }
});

// ─── Route: Current Weather by coordinates ───────────────────────────────────
app.get('/api/weather/coords', async (req, res) => {
  const { lat, lon } = req.query;
  const latNum = Number(lat);
  const lonNum = Number(lon);

  if (lat === undefined || lon === undefined || !Number.isFinite(latNum) || !Number.isFinite(lonNum)) {
    return res.status(400).json({ error: 'lat and lon must be valid numbers.' });
  }

  if (latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
    return res.status(400).json({ error: 'lat must be between -90 and 90 and lon must be between -180 and 180.' });
  }

  const cacheKey = `weather:${latNum.toFixed(2)},${lonNum.toFixed(2)}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json({ ...cached, cached: true });

  try {
    const data = await owmFetch('weather', { lat: latNum, lon: lonNum });
    setCache(cacheKey, data);
    res.json(data);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
});

// ─── Route: 5-Day Forecast by city name ──────────────────────────────────────
app.get('/api/forecast', async (req, res) => {
  const city = (req.query.city || '').trim();
  if (!city) return res.status(400).json({ error: 'City name is required.' });

  const cacheKey = `forecast:${city.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json({ ...cached, cached: true });

  try {
    const data = await owmFetch('forecast', { q: city });
    setCache(cacheKey, data);
    res.json(data);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message, code: err.owmCode || status });
  }
});

// ─── Route: 5-Day Forecast by coordinates ────────────────────────────────────
app.get('/api/forecast/coords', async (req, res) => {
  const { lat, lon } = req.query;
  const latNum = Number(lat);
  const lonNum = Number(lon);

  if (lat === undefined || lon === undefined || !Number.isFinite(latNum) || !Number.isFinite(lonNum)) {
    return res.status(400).json({ error: 'lat and lon must be valid numbers.' });
  }

  if (latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
    return res.status(400).json({ error: 'lat must be between -90 and 90 and lon must be between -180 and 180.' });
  }

  const cacheKey = `forecast:${latNum.toFixed(2)},${lonNum.toFixed(2)}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json({ ...cached, cached: true });

  try {
    const data = await owmFetch('forecast', { lat: latNum, lon: lonNum });
    setCache(cacheKey, data);
    res.json(data);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
});

// ─── Catch-all: serve index.html (SPA) ───────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🌤  Weather Telemetry Dashboard`);
  console.log(`   Server running at: http://localhost:${PORT}`);
  console.log(`   API status: ${API_KEY && API_KEY !== 'YOUR_API_KEY_HERE' ? '✅ Key configured' : '❌ Key missing – add to .env'}`);
  console.log(`   Press Ctrl+C to stop.\n`);
});
