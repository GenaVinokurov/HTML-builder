const fs = require('fs');
const path = require('path');
const process = require('process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Please, write text: '
});

const newFileName = path.join(__dirname, 'text.txt');
const newFile = fs.createWriteStream(newFileName);

rl.prompt();

rl.on('line', (input) => {
  (input.trim() == 'exit') ? rl.close() : newFile.write(input + '\n');
});
rl.on('SIGINT', () => { rl.close() });
rl.on('close', () => {
  process.stdout.write('Goodbye Bro!!!! I will miss you');
  newFile.end();
});