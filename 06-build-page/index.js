const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

//---------------creat project-dist

const projectPathNew = path.join(__dirname, 'project-dist');

const createFolder = (output) => {
  fsPromises.mkdir(output, (err) => {
    if (err) return;
  });
}
createFolder(projectPathNew)

//-----------bundle.css
const stylesFolder = path.join(__dirname, 'styles');
const bundleCss = (input) => {
  const newFile = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'))
  fs.access(input, err => {
    if (err) return;
  });
  fsPromises.readdir(input, { withFileTypes: true })
    .then(data => {
      data.forEach(el => {
        if (!el.isFile() || path.extname(el.name) !== '.css') return;

        let content = fs.createReadStream(path.join(input, el.name), 'utf-8');
        content.on('data', (text) => newFile.write(text.trim() + '\n\n'));
      });
    });
}
bundleCss(stylesFolder);

//----------HTML
const bundleHTML = () => {
  fs.readFile(path.join(__dirname, 'template.html'), 'utf-8', (err, data) => {
    let text = data;
    let textPaste;
    fs.readdir(
      path.join(__dirname, 'components'),
      { withFileTypes: true },
      (err, files) => {
        files.forEach((file) => {
          fs.readFile(
            path.join(__dirname, 'components', file.name),
            'utf-8',
            (err, dataPaste) => {
              textPaste = dataPaste;
              text = text.replace(
                `{{${path.parse(file.name).name}}}`,
                `\n${textPaste}`
              );
              fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), text, (err) => {
                if (err) throw err;
              }
              );
            }
          );
        });
      }
    );
  });
}

bundleHTML();

//---------------------Assets

function copyAssets() {
  fs.mkdir(
    path.join(__dirname, 'project-dist', 'assets'), { recursive: true }, (err) => {
      if (err) throw err;
    }
  );

  fs.readdir(
    path.join(__dirname, 'assets'), { withFileTypes: true }, (err, files) => {
      files.forEach((file) => {
        if (!file.isFile()) {
          let fileName = file.name;
          fs.mkdir(
            path.join(__dirname, 'project-dist', 'assets', fileName),
            (err) => {
              if (err) return;
            }
          );
          fs.readdir(
            path.join(__dirname, 'assets', fileName), { withFileTypes: true }, (err, files) => {
              files.forEach((file) => {
                if (file.isFile()) {
                  fs.copyFile(
                    path.join(__dirname, 'assets', fileName, file.name),
                    path.join(__dirname, 'project-dist', 'assets', fileName, file.name),
                    (err) => {
                      if (err) throw err;
                    }
                  );
                }
              });
            }
          );
        }
      });
    }
  );
}

copyAssets()