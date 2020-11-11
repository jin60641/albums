const fs = require('fs');
const path = require('path');

const PATH = path.resolve(__dirname, '..', 'src', 'images');
const dirs = fs.readdirSync(PATH);
dirs.forEach(dir => {
  const subDir = path.resolve(PATH, dir);
  const files = fs.readdirSync(subDir);
  files.forEach((file, i) => {
    fs.renameSync(path.resolve(subDir, file), path.resolve(subDir, `${i}.jpg`));
  });
});

module.exports = {};
