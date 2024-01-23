const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'styles');
const extension = '.css';
const distFolderPath = path.join(__dirname, 'project-dist');
const bundleFilePath = path.join(distFolderPath, 'bundle.css');

fs.writeFileSync(bundleFilePath, '');

fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error(`Error reading folder: ${err}`);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(dirPath, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error checking file stats: ${err}`);
          return;
        }

        if (stats.isFile() && path.extname(file) === extension) {
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              console.error(`Error reading file content: ${err}`);
              return;
            }

            fs.appendFileSync(bundleFilePath, data);
          });
        }
      });
    });

    console.log('bundle.css created in project-dist.');
});
