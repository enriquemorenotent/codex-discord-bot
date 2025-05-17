// bot.js – roasts via Hugging Face Llama-3, auto + on-demand, logs fetch errors
const { Client, GatewayIntentBits } = require("discord.js");
// Use built-in fetch on Node 18+, fall back to node-fetch for older versions
const fetch =
  global.fetch || ((...a) => import("node-fetch").then(({ default: f }) => f(...a)));
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
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
});

// ---------- Hugging Face generation -----------------------------------
const MODEL = "meta-llama/Meta-Llama-3-8B-Instruct";
const failMessage =
  "Sorry, but I seem to be having trouble accessing my AI brain. Ask the mods for help (not @ggoollpp, he will annoy you)";

async function getRoast(name = "friend") {
  const prompt = `Give me one short, savage but playful roast for a Discord user named "${name}".`;
  try {
    const r = await fetch(
      `https://api-inference.huggingface.co/models/${MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_new_tokens: 32, temperature: 0.9 },
        }),
      }
    );
    if (!r.ok) throw new Error(`HF ${r.status} ${r.statusText}`);
    const j = await r.json();
    const text = j[0]?.generated_text?.replace(prompt, "").trim();
    if (text) return text;
    throw new Error("empty response");
  } catch (err) {
    console.error("[HF] Roast fetch failed:", err.message);
    return failMessage;
  }
}

// ---------- activity & cooldown --------------------------------------
const lastSeen = new Map(); // userId → last message time
const cooldown = new Map(); // userId → last manual roast
const ACTIVE_MS = 15 * 60 * 1000; // 15 min window
const COOLDOWN_MS = 5 * 60 * 1000; // 5 min per-user
const now = () => Date.now();

// message handler
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

  const roast = await getRoast(target.username);
  msg.channel.send(`<@${target.id}> ${roast}`).catch(console.error);
  cooldown.set(target.id, now());
});

// automatic roast
async function roastRandomActive(guild, channel) {
  const cutoff = now() - ACTIVE_MS;
  const members = await guild.members.fetch();
  const humans = members.filter(
    (m) => !m.user.bot && (lastSeen.get(m.id) || 0) >= cutoff
  );
  if (!humans.size) return;

  const victim = humans.random();
  const roast = await getRoast(victim.displayName || victim.user.username);
  channel.send(`<@${victim.id}> ${roast}`).catch(console.error);
}

// startup
client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
  const guild = await client.guilds.fetch(GUILD_ID);
  const channel = await client.channels.fetch(CHANNEL_ID);
  setInterval(() => roastRandomActive(guild, channel), 10 * 60 * 1000);
});

client.login(TOKEN);
