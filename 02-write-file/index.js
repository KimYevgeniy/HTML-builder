const fs = require('node:fs');
const path = require('node:path');
const readline = require('readline');

const filePath = path.join(__dirname, 'writtenText.txt');
const writableStream = fs.createWriteStream(filePath);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function writeToStream(txt) {
  if (txt === 'exit') {
    rl.close();
    writableStream.end();
  } else {
    writableStream.write(txt + '\n');
    console.log(`Written to file: ${txt}`);
    rl.question('Type your text (type "exit" to end): ', writeToStream);
  }
}

rl.question('Type your text (type "exit" to end): ', writeToStream);

writableStream.on('finish', () => {
  console.log('Goodbye!');
});

writableStream.on('error', (err) => {
  console.error(`Error writing to ${filePath}: ${err}`);
});
