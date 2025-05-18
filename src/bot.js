import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { handleMessage } from './commands/index.js';

dotenv.config();

export function startBot() {
  const {
    DISCORD_TOKEN: TOKEN,
    DISCORD_CHANNEL_ID: CHANNEL_ID,
    DISCORD_GUILD_ID: GUILD_ID,
    HF_TOKEN,
  } = process.env;

  if (!TOKEN || !CHANNEL_ID || !GUILD_ID || !HF_TOKEN) {
    console.error(
      'Set DISCORD_TOKEN, DISCORD_CHANNEL_ID, DISCORD_GUILD_ID, HF_TOKEN'
    );
    process.exit(1);
  }

  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  });

  client.on('messageCreate', async (msg) => {
    if (msg.author.bot) return;
    if (!msg.guild || msg.guild.id !== GUILD_ID) return;
    if (msg.channel.id !== CHANNEL_ID) return;
    if (!msg.mentions.has(client.user)) return;
    const text = msg.content.replace(/<@!?\d+>/g, '').trim();
    if (!text) return;

    await handleMessage(msg, text);
  });

  client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
  });

  client.login(TOKEN);
}
