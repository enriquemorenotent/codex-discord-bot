import getAnswer from '../answer.js';
import { handlePredictionCommands } from './predictions.js';

/**
 * Handle a text message either from Discord or CLI.
 * @param {object} msg Discord message object
 * @param {string} text Text content without mention
 */
export async function handleMessage(msg, text) {
  const send = async (reply) => {
    await msg.channel.send(reply).catch(console.error);
  };
  const handled = await handlePredictionCommands({
    text,
    userId: msg.author.id,
    send,
  });
  if (handled) return;

  const answer = await getAnswer(text);
  await send(`<@${msg.author.id}> ${answer}`);
}
