require('dotenv').config();
const getRoast = require('./roast');

const name = process.argv[2] || 'friend';

getRoast(name)
  .then((r) => {
    console.log(r);
  })
  .catch((err) => {
    console.error('Error getting roast:', err);
    process.exit(1);
  });
