require('dotenv').config();
const getAnswer = require('./answer');
const { addPrediction, getPredictions } = require('./db');

const text = process.argv.slice(2).join(' ').trim();
if (!text) {
  console.error('Usage: npm run mention "<message>"');
  process.exit(1);
}

const USER_ID = 'local-user';

async function main() {
  const match = /agi will arrive on (.+)/i.exec(text);
  if (match) {
    const when = match[1].trim();
    addPrediction(USER_ID, when);
    console.log(`<@${USER_ID}> Prediction saved for ${when}`);
    return;
  }

  if (/^list agi predictions$/i.test(text)) {
    const predictions = getPredictions();
    if (predictions.length === 0) {
      console.log('No AGI predictions saved.');
    } else {
      const lines = predictions
        .map((p) => `<@${p.userId}> predicted ${p.date}`)
        .join('\n');
      console.log(lines);
    }
    return;
  }

  const answer = await getAnswer(text);
  console.log(`<@${USER_ID}> ${answer}`);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
