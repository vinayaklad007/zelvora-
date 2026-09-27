require('dotenv').config();
const { seedDatabase } = require('./seedData');

seedDatabase()
  .then(() => {
    console.log('Seeder runner finished successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeder runner failed:', err);
    process.exit(1);
  });
