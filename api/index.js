// Vercel Serverless Function Wrapper
module.exports = (req, res) => {
  try {
    // Lazy load the app to catch initialization errors
    const app = require('../src/app');
    app(req, res);
  } catch (error) {
    console.error("Critical Startup Error:", error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 
      error: "Server Startup Failed (Module Load)", 
      details: error.message, 
      stack: error.stack 
    }));
  }
};
