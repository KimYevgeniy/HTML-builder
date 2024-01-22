const fs = require('fs').promises;
const path = require('path');

const folder = path.join(__dirname, 'files');
const copy = path.join(__dirname, 'files-copy');

async function createFolder() {
  try {
    await fs.access(copy);
    await fs.rm(copy, { recursive: true });
  } catch (error) {}
  await fs.mkdir(copy);
}

async function copyFiles() {
  try {
    await fs.access(folder);
    const files = await fs.readdir(folder);

    for (const file of files) {
      const sourcePath = path.join(folder, file);
      const destinationPath = path.join(copy, file);

      const stats = await fs.stat(sourcePath);

      if (stats.isFile()) {
        await fs.copyFile(sourcePath, destinationPath);
      } else if (stats.isDirectory()) {
        await copyFiles(sourcePath, destinationPath);
      }
    }
  } catch (error) {
    console.error(`Folder not found.`);
  }
}

createFolder()
  .then(() => copyFiles())
  .catch((error) => console.error(error));
