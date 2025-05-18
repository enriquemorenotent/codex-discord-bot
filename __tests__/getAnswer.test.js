const getAnswer = require('../answer');

describe('getAnswer', () => {
  const oldFetch = global.fetch;
  afterEach(() => {
    global.fetch = oldFetch;
  });

  test('returns generated text from Hugging Face', async () => {
    const question = 'What is up?';
    const prompt = `Answer the following question clearly and concisely.\nQuestion: ${question}\nAnswer:`;
    const mockResponse = {
      ok: true,
      text: jest.fn().mockResolvedValue(
        JSON.stringify([{ generated_text: `${prompt} Great!` }])
      ),
    };
    global.fetch = jest.fn().mockResolvedValue(mockResponse);
    const ans = await getAnswer(question);
    expect(ans).toBe('Great!');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
