# Question Answering Discord Bot

This bot answers questions using a Hugging Face language model. Mention the bot
with a question and it will reply with an answer.

## Setup

1. Install dependencies (this also installs the SQLite library):
   ```bash
   npm install
   ```
   This bot uses the `fetch` API built into Node 18+. If you are on an
   earlier Node version, install `node-fetch`:
   ```bash
   npm install node-fetch
   ```
2. Copy `.env.example` to `.env` and fill in the required values:
   ```bash
   cp .env.example .env
   # edit .env
   ```
   DISCORD_TOKEN, DISCORD_CHANNEL_ID, DISCORD_GUILD_ID and HF_TOKEN must be set.

3. Run the bot:
   ```bash
   npm start
   ```

Ensure the bot has permission to send messages in the specified channel.

The bot only responds to messages in the guild and channel IDs provided in
`.env`.

### Testing the Hugging Face request

To test your Hugging Face configuration without running Discord, use:

```bash
npm run hf-test "What is the capital of France?"
```
This sends a real request to the configured model and prints the answer.

### Simulating a mention locally

You can test how the bot responds to a mention without running Discord by
using the `mention` script. Pass the message you want to send after the bot's
name:

```bash
npm run mention "Agi will arrive on 1st November 2012"
```

This prints the same response that would be sent in Discord when the bot is
mentioned with that text.

### AGI arrival predictions

Users can record their guesses about when AGI will be achieved by
posting a message that matches:

```
AGI will arrive on <date>
```

The bot stores these predictions in a local SQLite database. It attempts to
parse the date and keeps both the original text and a parsed date if one can be
determined. To see all
stored predictions, mention the bot with:

```
list agi predictions
```

To update or delete an existing prediction, use:

```
update prediction <id> to <date>
delete prediction <id>
```
