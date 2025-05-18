import dotenv from 'dotenv';
import getAnswer from './answer.js';
dotenv.config();

const question = process.argv.slice(2).join(' ') || "What's up?";

getAnswer(question)
  .then((r) => {
    console.log(r);
  })
  .catch((err) => {
    console.error('Error getting answer:', err);
    process.exit(1);
  });
