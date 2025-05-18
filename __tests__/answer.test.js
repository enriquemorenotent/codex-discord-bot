import { jest } from '@jest/globals';
import getAnswer from '../src/answer.js';

describe('getAnswer', () => {
  const failMessage =
    "Sorry, but I seem to be having trouble accessing my AI brain. Ask the mods for help (not @ggoollpp, he will annoy you)";

  beforeEach(() => {
    process.env.HF_TOKEN = 'test-token';
  });

  test('returns generated text on success', async () => {
    const question = 'What is 2+2?';
    const prompt = `Answer the following question clearly and concisely.\nQuestion: ${question}\nAnswer:`;
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: () =>
        Promise.resolve(
          JSON.stringify([{ generated_text: `${prompt} 4` }])
        ),
    });
    const ans = await getAnswer(question);
    expect(ans).toBe('4');
  });

  test('returns fail message on fetch error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network'));
    const ans = await getAnswer('hi');
    expect(ans).toBe(failMessage);
  });
});
