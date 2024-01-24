const fs = require('fs').promises;
const path = require('path');

const dirPath = path.join(__dirname, 'project-dist');
const stylePath = path.join(dirPath, 'style.css');
const indexPath = path.join(dirPath, 'index.html');
const stylesDirPath = path.join(__dirname, 'styles');
const templatePath = path.join(__dirname, 'template.html');
const componentsDirPath = path.join(__dirname, 'components');
const assetsDirPath = path.join(__dirname, 'assets');

async function createFolder() {
  try {
    const folderExists = await fs.access(dirPath)
      .then(() => true)
      .catch(() => false);

    if (folderExists) {
      console.log(`Folder "${dirPath}" already exists.`);
    } else {
      await fs.mkdir(dirPath);
    }
  } catch (error) {
    console.error(`Error creating or checking folder: ${error.message}`);
  }
}

async function createStyle() {
    try {
      await fs.writeFile(stylePath, '');
      console.log(`File "${stylePath}" created successfully.`);
    } catch (error) {
      console.error(`Error creating file: ${error.message}`);
    }
}

async function appendStyles() {
  try {
    const cssFiles = await fs.readdir(stylesDirPath);
    for (const cssFile of cssFiles) {
      const cssFilePath = path.join(stylesDirPath, cssFile);
      const cssContent = await fs.readFile(cssFilePath, 'utf-8');
      await fs.appendFile(stylePath, `${cssContent}`);
    }
  } catch (error) {
    console.error(`Error appending styles: ${error.message}`);
  }
}

async function createIndex() {
  try {
    await fs.writeFile(indexPath, '');
    console.log(`File "${indexPath}" created successfully.`);
  } catch (error) {
    console.error(`Error creating file: ${error.message}`);
  }
}

async function appendIndex() {
  try {
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    await fs.appendFile(indexPath, `${templateContent}`);
  } catch (error) {
    console.error(`Error appending template content: ${error.message}`);
  }
}

async function modifyIndex() {
  try {
    let indexContent = await fs.readFile(indexPath, 'utf-8');
    const htmlFiles = await fs.readdir(componentsDirPath);

    for (const htmlFile of htmlFiles) {
      const htmlFilePath = path.join(componentsDirPath, htmlFile);
      const fileName = path.parse(htmlFile).name;
      const htmlContent = await fs.readFile(htmlFilePath, 'utf-8');

      if (indexContent.includes(`{{${fileName}}}`)) {
        indexContent = indexContent.replace(`{{${fileName}}}`, htmlContent);
        await fs.writeFile(indexPath, indexContent, 'utf-8');
      } else {
        console.log(`${fileName} not found in index.html.`);
      }
    }
  } catch (error) {
    console.error(`Error modifying index.html: ${error.message}`);
  }
}

async function copyFiles(source, destination) {
  try {
    const stats = await fs.stat(source);

    if (stats.isFile()) {
      await fs.copyFile(source, destination);
    } else if (stats.isDirectory()) {
      await fs.mkdir(destination, { recursive: true });

      const files = await fs.readdir(source);

      for (const file of files) {
        const sourcePath = path.join(source, file);
        const destinationPath = path.join(destination, file);

        await copyFiles(sourcePath, destinationPath);
      }
    }

  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Source not found: ${source}`);
    } else {
      console.error(`Error copying files: ${error.message}`);
    }
  }
}

async function copyAssets() {
  try {
    const exists = await fs.access(assetsDirPath).then(() => true).catch(() => false);

    if (exists) {
      const assetsDestinationPath = path.join(dirPath, 'assets');
      await fs.mkdir(assetsDestinationPath, { recursive: true });
      await copyFiles(assetsDirPath, assetsDestinationPath);
    }
  } catch (error) {
    console.error(`Error checking assets directory: ${error.message}`);
  }
}

async function createFolderAndFiles() {
  await createFolder();
  await createStyle();
  await appendStyles();
  await createIndex();
  await appendIndex();
  await modifyIndex();
  await copyAssets();
}

createFolderAndFiles();