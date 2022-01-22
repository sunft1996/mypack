const fs = require('fs');

function isFileExist(resource, callback, notFoundCallback) {
  let stats;
  try {
    stats = fs.statSync(resource);
  } catch (err) { }
  if (!stats) {
    if (notFoundCallback) { notFoundCallback(); } else {
      throw new Error(`[mypack error] can not find file:${resource}`);
    }
  } else if (callback) callback();
}

module.exports = {
  isFileExist,
};
