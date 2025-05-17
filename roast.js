const fetch =
  global.fetch || ((...a) => import('node-fetch').then(({ default: f }) => f(...a)));

const { HF_TOKEN } = process.env;

const MODEL = 'meta-llama/Meta-Llama-Guard-2-8B';
const failMessage =
  'Sorry, but I seem to be having trouble accessing my AI brain. Ask the mods for help (not @ggoollpp, he will annoy you)';

async function getRoast(name = 'friend') {
  const prompt = `Give me one short, savage but playful roast for a Discord user named "${name}".`;
  const url = `https://api-inference.huggingface.co/models/${MODEL}`;
  const bodyData = {
    inputs: prompt,
    parameters: { max_new_tokens: 32, temperature: 0.9 },
  };
  const opts = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyData),
  };
  try {
    const r = await fetch(url, opts);
    const respText = await r.text();
    if (!r.ok) {
      console.error('[HF] Request failed', {
        request: { url, method: 'POST', body: bodyData },
        response: {
          status: r.status,
          statusText: r.statusText,
          body: respText,
        },
      });
      return failMessage;
    }
    let j;
    try {
      j = JSON.parse(respText);
    } catch (e) {
      console.error('[HF] JSON parse error', {
        request: { url, method: 'POST', body: bodyData },
        response: respText,
      });
      return failMessage;
    }
    const text = j[0]?.generated_text?.replace(prompt, '').trim();
    if (text) return text;
    console.error('[HF] Unexpected response', {
      request: { url, method: 'POST', body: bodyData },
      response: j,
    });
    return failMessage;
  } catch (err) {
    console.error('[HF] Roast fetch error', {
      request: { url, method: 'POST', body: bodyData },
      error: err.message,
    });
    return failMessage;
  }
}

module.exports = getRoast;
