import dotenv from 'dotenv';
import getAnswer from './answer.js';
import { handlePredictionCommands } from './commands/predictions.js';

dotenv.config();

const text = process.argv.slice(2).join(' ').trim();
if (!text) {
  console.error('Usage: npm run mention "<message>"');
  process.exit(1);
}

const USER_ID = 'local-user';

async function send(msg) {
  console.log(msg);
}

async function main() {
  const handled = await handlePredictionCommands({
    text,
    userId: USER_ID,
    send,
  });
  if (!handled) {
    const answer = await getAnswer(text);
    console.log(`<@${USER_ID}> ${answer}`);
  }
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
