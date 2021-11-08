const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');

const pathFolder = path.join(__dirname, 'secret-folder');

fsPromises.readdir(pathFolder, { withFileTypes: true })
  .then(data => {
    data.forEach(el => {
      fs.stat(path.join(pathFolder, el.name), (err, stats) => {
        if (err) throw err;
        if (!stats.isFile()) return;

        let fileExtName = path.extname(el.name);
        let fileName = path.basename(el.name, fileExtName);
        let fileSize = Math.ceil(stats.size / 1024);

        console.log(`${fileName} - ${fileExtName.slice(1)} - ${fileSize}kb`);
      });
    });
  }).catch(err => console.log(err));
