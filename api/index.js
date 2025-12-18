const app = require('../src/app');

// Vercel Serverless Function Wrapper
module.exports = (req, res) => {
  app(req, res);
};
