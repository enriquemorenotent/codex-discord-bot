// Simple question answering bot using Hugging Face
import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
// Load environment variables before importing other modules
dotenv.config();
// Fetch answers from Hugging Face
import getAnswer from "./answer.js";
import {
  addPrediction,
  getPredictions,
  updatePrediction,
  deletePrediction,
} from "./db.js";

const {
  DISCORD_TOKEN: TOKEN,
  DISCORD_CHANNEL_ID: CHANNEL_ID,
  DISCORD_GUILD_ID: GUILD_ID,
  HF_TOKEN,
} = process.env;

if (process.env.NODE_ENV === "development") {
  console.log("Environment variables:");
  console.log("DISCORD_TOKEN:", TOKEN);
  console.log("DISCORD_CHANNEL_ID:", CHANNEL_ID);
  console.log("DISCORD_GUILD_ID:", GUILD_ID);
  console.log("HF_TOKEN:", HF_TOKEN);
}

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
  if (!msg.guild || msg.guild.id !== GUILD_ID) return;
  if (msg.channel.id !== CHANNEL_ID) return;
  if (!msg.mentions.has(client.user)) return;
  const text = msg.content.replace(/<@!?\d+>/g, "").trim();
  if (!text) return;

  const match = /agi will arrive on (.+)/i.exec(text);
  if (match) {
    const when = match[1].trim();
    addPrediction(msg.author.id, when);
    const mention = `<@${msg.author.id}>`;
    msg.channel
      .send(`${mention} Prediction saved for ${when}`)
      .catch(console.error);
    return;
  }

  const updateMatch = /^update prediction (\d+) to (.+)/i.exec(text);
  if (updateMatch) {
    const id = parseInt(updateMatch[1], 10);
    const when = updateMatch[2].trim();
    updatePrediction(id, when);
    const mention = `<@${msg.author.id}>`;
    msg.channel
      .send(`${mention} Prediction ${id} updated to ${when}`)
      .catch(console.error);
    return;
  }

  const deleteMatch = /^delete prediction (\d+)/i.exec(text);
  if (deleteMatch) {
    const id = parseInt(deleteMatch[1], 10);
    deletePrediction(id);
    const mention = `<@${msg.author.id}>`;
    msg.channel
      .send(`${mention} Prediction ${id} deleted`)
      .catch(console.error);
    return;
  }

  if (/^list agi predictions$/i.test(text)) {
    const predictions = getPredictions();
    if (predictions.length === 0) {
      msg.channel.send("No AGI predictions saved.").catch(console.error);
    } else {
      const lines = predictions
        .map((p) => `<@${p.userId}> predicted ${p.date}`)
        .join("\n");
      msg.channel.send(lines).catch(console.error);
    }
    return;
  }

  const answer = await getAnswer(text);
  const mention = `<@${msg.author.id}>`;
  msg.channel.send(`${mention} ${answer}`).catch(console.error);
});

// startup
client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(TOKEN);
