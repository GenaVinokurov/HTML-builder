const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const stylesFolder = path.join(__dirname, 'styles');
const outputFolder = path.join(__dirname, 'project-dist', 'bundle.css');

const bundleCss = (input, output) => {

  const newFile = fs.createWriteStream(output);
  fs.access(input, (err) => {
    if (err) throw err;
    fsPromises.readdir(input, { withFileTypes: true })
      .then(data => {
        data.forEach(el => {
          if (!el.isFile() || path.extname(el.name) !== '.css') return;

          let content = fs.createReadStream(path.join(input, el.name), 'utf-8');
          content.on('data', (text) => newFile.write(text.trim() + '\n\n'));
        });
      })
      .catch(err => console.log(err));
  });
};

bundleCss(stylesFolder, outputFolder);
