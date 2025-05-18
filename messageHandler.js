const getAnswer = require('./answer');

async function handleMessage(client, msg) {
  if (msg.author.bot) return;
  if (!msg.mentions.has(client.user)) return;
  const question = msg.content.replace(/<@!?\d+>/g, '').trim();
  if (!question) return;
  const answer = await getAnswer(question);
  await msg.reply(answer).catch(console.error);
}

module.exports = handleMessage;
