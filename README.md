# 🌤 Live Weather Telemetry Dashboard

A premium, fully-functional real-time weather application built with **Node.js + Express** (backend) and **HTML5 / CSS3 / Vanilla JS** (frontend). It proxies all OpenWeatherMap API calls through the server so your API key is **never exposed to the browser**.

---

## ✨ Features

| Feature | Detail |
|---------|--------|
| 🌍 Global City Search | Search any city worldwide with Enter-key support |
| 📍 Geolocation | One-click current-location weather with browser permission |
| 🌡️ Current Weather | Temp, feels-like, min/max, description, weather icon |
| 🌅 Sunrise & Sunset | Displayed in the city's local time |
| 💧 Telemetry Cards | Humidity, Wind Speed, Atmospheric Pressure, Visibility |
| 📅 5-Day Forecast | Daily summaries with icons and temperature ranges |
| 🎨 Dynamic Backgrounds | 7 weather-themed animated gradients (Sunny, Rainy, Cloudy, Night, Snowy, Stormy, Foggy) |
| 🕐 Live Clock | Real-time updating date & time |
| 🕘 Search History | Last 6 searched cities as quick-access pills |
| ⚡ Caching | Server-side (10-min) + client-side (10-min) cache to avoid redundant API calls |
| ♿ Accessible | ARIA labels, keyboard navigation, focus rings |
| 📱 Responsive | Desktop, tablet, and mobile layouts |

---

## 🛠 Technology Stack

- **Frontend**: HTML5, CSS3 (Glassmorphism), JavaScript ES6+, Fetch API, Async/Await
- **Backend**: Node.js, Express.js
- **Icons**: Lucide Icons (CDN) + Weather Emojis
- **Fonts**: Space Grotesk, Inter (Google Fonts)
- **API**: [OpenWeatherMap](https://openweathermap.org/api)
- **Security**: dotenv — API key stored server-side only

---

## 📁 Project Structure

```
intenship project 3/
│
├── public/                   # Static frontend assets (served by Express)
│   ├── index.html            # Main HTML page
│   ├── css/
│   │   └── style.css         # Complete stylesheet (glassmorphism + responsive)
│   ├── js/
│   │   └── script.js         # Frontend JS (fetch, render, caching, events)
│   └── assets/               # (Reserved for custom icons / images)
│
├── server.js                 # Express backend proxy + static file server
├── package.json              # Project metadata & dependencies
├── .env                      # 🔑 Your secret API key (never commit this)
├── .env.example              # Safe template to share with others
├── .gitignore                # Excludes .env and node_modules
└── README.md                 # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16 or higher → [Download](https://nodejs.org)
- A free **OpenWeatherMap API key** (see below)

---

### Step 1 — Get Your OpenWeatherMap API Key

1. Create a **free account** at [https://home.openweathermap.org/users/sign_up](https://home.openweathermap.org/users/sign_up)
2. After signing in, go to **API Keys** in your profile menu
3. Copy the **Default** key (or click **Generate** to create a new one)
4. The key may take **up to 2 hours** to activate on a new account

> **Free tier limits:** 60 calls/minute, 1,000,000 calls/month — more than enough for this dashboard.

---

### Step 2 — Configure the `.env` File

Open the `.env` file in the project root and replace `YOUR_API_KEY_HERE`:

```env
OPENWEATHER_API_KEY=abc123youractualkey456here
PORT=3000
```

> ⚠️ **Never** commit `.env` to version control. It is already listed in `.gitignore`.

---

### Step 3 — Install Dependencies

```bash
cd "D:\intenship project 3"
npm install
```

---

### Step 4 — Run the Application

```bash
npm start
```

You should see:

```
🌤  Weather Telemetry Dashboard
   Server running at: http://localhost:3000
   API status: ✅ Key configured
   Press Ctrl+C to stop.
```

Open **http://localhost:3000** in your browser.

---

### Optional: Development Mode (auto-restart on file changes)

```bash
npm run dev
```

---

## 🔌 API Endpoint Documentation

All endpoints are served by the Express backend proxy. The API key is **never sent to the browser**.

### `GET /api/weather?city={cityName}`
Fetch current weather for a city by name.

| Param | Type | Description |
|-------|------|-------------|
| `city` | string | City name (e.g. `Chennai`, `London`, `New York`) |

**Success response:** OpenWeatherMap `/data/2.5/weather` JSON (units: metric)

---

### `GET /api/weather/coords?lat={lat}&lon={lon}`
Fetch current weather by geographic coordinates.

| Param | Type | Description |
|-------|------|-------------|
| `lat` | float | Latitude |
| `lon` | float | Longitude |

---

### `GET /api/forecast?city={cityName}`
Fetch 5-day / 3-hour forecast for a city.

| Param | Type | Description |
|-------|------|-------------|
| `city` | string | City name |

---

### `GET /api/forecast/coords?lat={lat}&lon={lon}`
Fetch 5-day forecast by coordinates (used by geolocation feature).

---

## 🎨 Dynamic Weather Backgrounds

| Condition | CSS Class | Colors |
|-----------|-----------|--------|
| Clear/Sunny | `.bg-sunny` | Warm orange → amber gradient |
| Rainy | `.bg-rainy` | Deep blue → bright blue gradient |
| Cloudy | `.bg-cloudy` | Dark grey → light grey gradient |
| Night | `.bg-night` | Dark navy → deep purple gradient |
| Snowy | `.bg-snowy` | Light blue → sky blue gradient |
| Thunderstorm | `.bg-stormy` | Very dark grey → near-black gradient |
| Foggy/Mist | `.bg-foggy` | Medium grey → almost white gradient |

---

## 🧪 Testing Checklist

- [x] Chennai (default city on load)
- [x] Another city: `London`, `Tokyo`, `New York`
- [x] Invalid city: `xyzabc123` → friendly error shown, previous data preserved
- [x] Geolocation button → browser permission prompt
- [x] Refresh button → clears cache, re-fetches data
- [x] History pills → click to reload that city's weather
- [x] Enter key in search field
- [x] Mobile layout (< 600px)
- [x] No `console.error` logs on successful load

---

## 📝 Notes

- The first API call after getting a **new** key may return a `401` error. Wait up to **2 hours** for the key to activate.
- Server-side cache is **in-memory** (resets on server restart). It prevents hammering the API during development.
- Client-side cache uses `sessionStorage` and also expires after 10 minutes.

---

## 📄 License

MIT — free to use and modify.
