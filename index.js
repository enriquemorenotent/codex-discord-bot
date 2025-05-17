const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const jokes = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "I told my computer I needed a break, and it said 'No problem, I'll go to sleep.'",
  "Why did the scarecrow win an award? Because he was outstanding in his field!"
];

const token = process.env.DISCORD_TOKEN;
const channelId = process.env.DISCORD_CHANNEL_ID;

if (!token || !channelId) {
  console.error('DISCORD_TOKEN and DISCORD_CHANNEL_ID must be set in the environment');
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

function sendJoke(channel) {
  const joke = jokes[Math.floor(Math.random() * jokes.length)];
  channel.send(joke).catch(console.error);
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.channels.fetch(channelId)
    .then(channel => {
      sendJoke(channel);
      setInterval(() => sendJoke(channel), 5 * 60 * 1000);
    })
    .catch(err => {
      console.error('Failed to fetch channel:', err);
      process.exit(1);
    });
});

client.login(token);
