# Insyd Inventory Management System

This repository contains the solution for the Insyd SDE Intern Assignment.
It implements a Digital Inventory Tracking System with a Next.js frontend and an Express.js backend.

## Structure
- `problem_solving.md`: Part 1 - Problem Solving Document.
- `client/`: Part 2 - Frontend Application (Next.js 14).
- `server/`: Part 2 - Backend API (Express.js + SQLite).

## Prerequisites
- Node.js installed.
- Git.

## Setup & Running

You need to run both the Client and the Server simultaneously.

### 1. Start the Backend API
The backend runs on port 5000 and uses a local SQLite database (`inventory.db`).

```bash
cd server
npm install
npm start
```
*The server will start at http://localhost:5000*

### 2. Start the Frontend
The frontend runs on port 3000.

```bash
cd client
npm install
npm run dev
```
*Open http://localhost:3000 in your browser.*

## Features Implemented
- **Real-time Inventory Dashboard**: View total stock value and low stock alerts.
- **Inventory Management**: Add, Update, and Delete items.
- **Search & Filtering**: Quickly find items by SKU or Name.
- **Visual Status**: Color-coded badges for stock levels (Low, Good, Excess).

## Deployment

### Backend (Render/Heroku/Vercel)
To deploy the backend, push the `server` folder (or root with build scripts).
*Note: SQLite is file-based, so data won't persist across restarts on ephemeral hosting like Vercel. For production, switch `database.js` to PostgreSQL (e.g., Neon/Supabase).*

### Frontend (Vercel)
Connect the `client` folder to Vercel. 
Environment Variables needed:
- `NEXT_PUBLIC_API_URL`: URL of your deployed backend.
