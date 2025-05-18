const handleMessage = require('../messageHandler');

jest.mock('../answer', () => jest.fn(() => Promise.resolve('42')));
const getAnswer = require('../answer');

describe('message handler', () => {
  test('replies with answer when mentioned', async () => {
    const client = { user: { id: 'bot' } };
    const reply = jest.fn().mockResolvedValue();
    const msg = {
      author: { bot: false },
      mentions: { has: jest.fn().mockReturnValue(true) },
      content: '<@123> life?',
      reply,
    };

    await handleMessage(client, msg);

    expect(getAnswer).toHaveBeenCalledWith('life?');
    expect(reply).toHaveBeenCalledWith('42');
  });
});
