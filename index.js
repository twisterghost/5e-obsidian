const fs = require("fs");
const glob = require("glob");

const input = fs.readFileSync('./src.md', 'utf8');

let lines = input.split('\n');

let workingFileName = '';
let workingFileContent = '';

function writeCurrentFile(prefix = '') {
  if (workingFileContent.trim() !== "") {
    let fixedName = workingFileName.replace('/', ' slash ').replace("'", '');
    console.log(`Writing ./out/${fixedName}.md`);
    fs.writeFileSync(`./out/${prefix}${fixedName}.md`, `# ${workingFileName}\n${workingFileContent}`, 'utf8');
  }
}

function clearFile() {
  workingFileName = '';
  workingFileContent = '';
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.indexOf('# ') === 0) {
    writeCurrentFile();
    clearFile();
    if (line.indexOf(': ') !== -1) {
      workingFileName = line.split(': ')[1];
    } else {
      workingFileName = line.replace('# ', '');
    }
  } else {
    workingFileContent += line + '\n';
  }
}

writeCurrentFile();

console.log('Fixing spell files...');

glob("./out/Spells (*.md", function(err, files) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  files.forEach(file => {
    console.log('Fixing', file);
    const fileContent = fs.readFileSync(file, 'utf8');
    let lines = fileContent.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.indexOf('#### ') === 0) {
        workingFileContent += '\n#spell';
        writeCurrentFile('spells/');
        clearFile();
        if (line.indexOf(': ') !== -1) {
          workingFileName = line.split(': ')[1];
        } else {
          workingFileName = line.replace('#### ', '');
        }
      } else {
        workingFileContent += line + '\n';
      }
    }

    workingFileContent += '\n#spell';
    writeCurrentFile('spells/');

    fs.unlinkSync(file);
  });
});

console.log('Fixing creature files...');

glob("./out/Creatures (*.md", function(err, files) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  files.forEach(file => {
    console.log('Fixing', file);
    const fileContent = fs.readFileSync(file, 'utf8');
    let lines = fileContent.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.indexOf('## ') === 0) {
        workingFileContent += '\n#creature';
        writeCurrentFile('creatures/');
        clearFile();
        if (line.indexOf(': ') !== -1) {
          workingFileName = line.split(': ')[1];
        } else {
          workingFileName = line.replace('## ', '');
        }
      } else {
        workingFileContent += line + '\n';
      }
    }

    workingFileContent += '\n#creature';
    writeCurrentFile('creatures/');

    fs.unlinkSync(file);
  });
});

console.log('Fixing monster files...');

glob("./out/Monsters (*.md", function(err, files) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  files.forEach(file => {
    console.log('Fixing', file);
    const fileContent = fs.readFileSync(file, 'utf8');
    let lines = fileContent.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.indexOf('## ') === 0) {
        workingFileContent += '\n#monster';
        writeCurrentFile('monsters/');
        clearFile();
        if (line.indexOf(': ') !== -1) {
          workingFileName = line.split(': ')[1];
        } else {
          workingFileName = line.replace('## ', '');
        }
      } else {
        workingFileContent += line + '\n';
      }
    }

    workingFileContent += '\n#monster';
    writeCurrentFile('monsters/');

    fs.unlinkSync(file);
  });
});

console.log('Fixing item files...');

glob("./out/Magic Items (*.md", function(err, files) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  files.forEach(file => {
    console.log('Fixing', file);
    const fileContent = fs.readFileSync(file, 'utf8');
    let lines = fileContent.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.indexOf('### ') === 0) {
        workingFileContent += '\n#item';
        writeCurrentFile('items/');
        clearFile();
        if (line.indexOf(': ') !== -1) {
          workingFileName = line.split(': ')[1];
        } else {
          workingFileName = line.replace('### ', '');
        }
      } else {
        workingFileContent += line + '\n';
      }
    }

    workingFileContent += '\n#item';
    writeCurrentFile('items/');

    fs.unlinkSync(file);
  });
});
