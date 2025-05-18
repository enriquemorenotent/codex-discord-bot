// Simple question answering bot using Hugging Face
const { Client, GatewayIntentBits } = require("discord.js");
// Fetch answers from Hugging Face
const getAnswer = require("./answer");
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
client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
  if (!msg.mentions.has(client.user)) return;
  const question = msg.content.replace(/<@!?\d+>/g, "").trim();
  if (!question) return;
  const answer = await getAnswer(question);
  msg.reply(answer).catch(console.error);
});

// startup
client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(TOKEN);
