const app = require('../src/app');

module.exports = (req, res) => {
  try {
    app(req, res);
  } catch (error) {
    console.error("Critical Startup Error:", error);
    res.status(500).json({ 
      error: "Server Startup Failed", 
      details: error.message, 
      stack: error.stack 
    });
  }
};
