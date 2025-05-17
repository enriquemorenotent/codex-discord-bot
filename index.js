// bot.js – auto-roasts + “@Bot roast @user” with 5-min user cooldown
const { Client, GatewayIntentBits } = require("discord.js");
const fetch = global.fetch || ((...a) => import("node-fetch").then(({ default: f }) => f(...a)));
require("dotenv").config();

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

if (!TOKEN || !CHANNEL_ID || !GUILD_ID) {
  console.error(
    "DISCORD_TOKEN, DISCORD_CHANNEL_ID and DISCORD_GUILD_ID must be set"
  );
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
});

const fallbackRoasts = [
  "You bring everyone so much joy… when you leave the room.",
  "Some drink from the fountain of knowledge; you just gargle.",
  "I’d agree with you, but then we’d both be wrong.",
];

async function getRoast() {
  try {
    const r = await fetch(
      "https://evilinsult.com/generate_insult.php?lang=en&type=text"
    );
    if (!r.ok) throw 0;
    return (await r.text()).trim();
  } catch {
    return fallbackRoasts[Math.floor(Math.random() * fallbackRoasts.length)];
  }
}

const lastSeen = new Map(); // userId → timestamp
const cooldown = new Map(); // userId → timestamp
const ACTIVE_MS = 15 * 60 * 1000; // 15 minutes
const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes
const now = () => Date.now();

// track activity + handle manual roast command
client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
  lastSeen.set(msg.author.id, now());

  if (!msg.mentions.has(client.user)) return;
  const target = msg.mentions.users
    .filter((u) => u.id !== client.user.id)
    .first();
  if (!target) return;

  if (now() - (cooldown.get(target.id) || 0) < COOLDOWN_MS) {
    msg.reply(
      "Dude, he just got roasted... give him a second to dry his tears first!"
    );
    return;
  }

  msg.channel.send(`<@${target.id}> ${await getRoast()}`).catch(console.error);
  cooldown.set(target.id, now());
});

// automatic roast every 10 min, but only to humans active in last 15 min
async function roastRandomActive(guild, channel) {
  const cutoff = now() - ACTIVE_MS;
  const members = await guild.members.fetch();
  const candidates = members.filter(
    (m) => !m.user.bot && (lastSeen.get(m.id) || 0) >= cutoff
  );
  if (!candidates.size) return;
  const victim = candidates.random();
  channel.send(`<@${victim.id}> ${await getRoast()}`).catch(console.error);
}

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
  const guild = await client.guilds.fetch(GUILD_ID);
  const channel = await client.channels.fetch(CHANNEL_ID);
  setInterval(() => roastRandomActive(guild, channel), 10 * 60 * 1000);
});

client.login(TOKEN);
