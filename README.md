# Joke Discord Bot

This bot posts a random joke to a specific channel every 5 minutes.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
   This bot uses the `fetch` API built into Node 18+. If you are on an
   earlier Node version, install `node-fetch`:
   ```bash
   npm install node-fetch
   ```
2. Copy `.env.example` to `.env` and fill in your Discord token and channel ID:
   ```bash
   cp .env.example .env
   # edit .env
   ```
3. Run the bot:
   ```bash
   npm start
   ```

Ensure the bot has permission to send messages in the specified channel.
