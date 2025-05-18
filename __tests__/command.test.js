describe('command parsing', () => {
  test('add prediction', () => {
    const m = /agi will arrive on (.+)/i.exec('AGI will arrive on 1 Jan 2030');
    expect(m[1]).toBe('1 Jan 2030');
  });

  test('update prediction', () => {
    const m = /^update prediction (\d+) to (.+)/i.exec('update prediction 2 to tomorrow');
    expect(m[1]).toBe('2');
    expect(m[2]).toBe('tomorrow');
  });

  test('delete prediction', () => {
    const m = /^delete prediction (\d+)/i.exec('delete prediction 5');
    expect(m[1]).toBe('5');
  });

  test('list predictions', () => {
    expect(/^list agi predictions$/i.test('List AGI predictions')).toBe(true);
  });
});
