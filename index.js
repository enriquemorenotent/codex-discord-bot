// Simple question answering bot using Hugging Face
const { Client, GatewayIntentBits } = require("discord.js");
// Fetch answers from Hugging Face
const getAnswer = require("./answer");
const handleMessage = require("./messageHandler");
require("dotenv").config();

const {
  DISCORD_TOKEN: TOKEN,
  DISCORD_CHANNEL_ID: CHANNEL_ID,
  DISCORD_GUILD_ID: GUILD_ID,
  HF_TOKEN,
} = process.env;

if (!TOKEN || !CHANNEL_ID || !GUILD_ID || !HF_TOKEN) {
  console.error(
    "Set DISCORD_TOKEN, DISCORD_CHANNEL_ID, DISCORD_GUILD_ID, HF_TOKEN"
  );
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// ---------- Hugging Face generation -----------------------------------
// getAnswer is provided by ./answer

// message handler
client.on("messageCreate", (msg) => handleMessage(client, msg));

// startup
client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(TOKEN);
