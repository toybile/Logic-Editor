const { chromium } = require("playwright");
module.exports.chromium = {
  launch(options = {}) {
    const executablePath = process.env.LP_CHROME_PATH || options.executablePath;
    return chromium.launch({ ...options, executablePath });
  },
};
