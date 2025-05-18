import {
  addPrediction,
  getPredictions,
  updatePrediction,
  deletePrediction,
} from '../db.js';

/**
 * Handle AGI prediction related commands.
 * @param {{text:string,userId:string,send:(msg:string)=>Promise<void>}} ctx
 * @returns {Promise<boolean>} true if a command was handled
 */
export async function handlePredictionCommands(ctx) {
  const { text, userId, send } = ctx;
  const addMatch = /agi will arrive on (.+)/i.exec(text);
  if (addMatch) {
    const when = addMatch[1].trim();
    addPrediction(userId, when);
    await send(`<@${userId}> Prediction saved for ${when}`);
    return true;
  }

  const updateMatch = /^update prediction (\d+) to (.+)/i.exec(text);
  if (updateMatch) {
    const id = parseInt(updateMatch[1], 10);
    const when = updateMatch[2].trim();
    updatePrediction(id, when);
    await send(`<@${userId}> Prediction ${id} updated to ${when}`);
    return true;
  }

  const deleteMatch = /^delete prediction (\d+)/i.exec(text);
  if (deleteMatch) {
    const id = parseInt(deleteMatch[1], 10);
    deletePrediction(id);
    await send(`<@${userId}> Prediction ${id} deleted`);
    return true;
  }

  if (/^list agi predictions$/i.test(text)) {
    const predictions = getPredictions();
    if (predictions.length === 0) {
      await send('No AGI predictions saved.');
    } else {
      const lines = predictions
        .map((p) => `<@${p.userId}> predicted ${p.date}`)
        .join('\n');
      await send(lines);
    }
    return true;
  }

  return false;
}
