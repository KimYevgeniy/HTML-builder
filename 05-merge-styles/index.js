const fs = require('fs').promises;
const path = require('path');

const dirPath = path.join(__dirname, 'styles');
const extension = '.css';
const distFolderPath = path.join(__dirname, 'project-dist');
const bundleFilePath = path.join(distFolderPath, 'bundle.css');

fs.mkdir(distFolderPath, { recursive: true })
  .then(() => {
    return fs.writeFile(bundleFilePath, '');
  })
  .then(() => {
    return fs.readdir(dirPath);
  })
  .then((files) => {
    const filePromises = files.map((file) => {
      const filePath = path.join(dirPath, file);

      return fs.stat(filePath)
        .then((stats) => {
          if (stats.isFile() && path.extname(file) === extension) {

            return fs.readFile(filePath, 'utf8')
              .then((data) => {
                return fs.appendFile(bundleFilePath, data)
                  .then(() => {
                    console.log(`${file} has been added to bundle.css.`);
                  });
              });
          }
        });
    });

    return Promise.all(filePromises);
  })
  .then(() => {
    console.log('bundle.css created in project-dist folder.');
  })
  .catch((err) => {
    console.error(`Error: ${err}`);
  });
