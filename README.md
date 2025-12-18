# Pricing Feature (Demo)

## What this is

A beginner‑friendly demo of a pricing feature using React + Node.js.

The project is split into:

- a small **Node.js/Express backend** that serves product data and pricing previews
- a **React frontend** (Vite + TypeScript) that provides the pricing profile UI

## How to run

Make sure you have a recent version of Node.js installed.

### Backend

```bash
cd backend
npm install
node src/server.js
```

The backend will start on `http://localhost:4000`.

### Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Then open the URL shown in the terminal (typically `http://localhost:5173`).

## Features

- Product search
- Product selection
- Fixed & percentage pricing adjustments
- Preview pricing before applying

## Tradeoffs

- No database (in‑memory only)
- Minimal validation
- Focused on clarity over completeness

## Future improvements

- Persist pricing profiles
- Add filters
- Add tests
