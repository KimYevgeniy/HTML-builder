const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, { withFileTypes: true }, (err, dirents) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  dirents.forEach((dirent) => {
    const fileName = dirent.name;
    const filePath = path.join(dirPath, fileName);

    if (dirent.isFile()) {
      fs.stat(filePath, (statErr, stats) => {
        if (statErr) {
          console.error(`Error getting stats for ${fileName}:`, statErr);
          return;
        }

        const name = path.parse(fileName).name;
        const format = path.parse(fileName).ext.slice(1);
        const size = stats.size;

        console.log(`${name} - ${format} - ${size}bytes`);
      });
    }
  });
});
