const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');

const pathFolder = path.join(__dirname, 'files');
const pathFolderNew = path.join(__dirname, 'files-copy');

const copyDir = (pathFolder, pathFolderNew) => {
  fs.access(pathFolderNew, (err) => {
    if (err) {
      fsPromises.mkdir(pathFolderNew, { recursive: true }).catch(err => console.log(err));
    }
    fsPromises.readdir(pathFolder, { withFileTypes: true }).then(data => {
      data.forEach(el => {
        fsPromises.copyFile(path.join(pathFolder, el.name), path.join(pathFolderNew, el.name));
      });
    });
  });
}
copyDir(pathFolder, pathFolderNew);