require('dotenv').config();
const getAnswer = require('./answer');

const question = process.argv.slice(2).join(' ') || "What's up?";

getAnswer(question)
  .then((r) => {
    console.log(r);
  })
  .catch((err) => {
    console.error('Error getting answer:', err);
    process.exit(1);
  });
