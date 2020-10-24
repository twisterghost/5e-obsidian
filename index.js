const fs = require("fs");
const path = require("path");
const glob = require("glob");

const OUT_DIR = "reference";
const input = fs.readFileSync('./src.md', 'utf8');

let lines = input.split('\n');

let workingFileName = '';
let workingFileContent = '';
let indexedFiles = [];

function writeCurrentFile(prefix = '') {
  if (workingFileName.trim() !== "" && workingFileContent.trim() !== "" && workingFileName !== "Licensing") {
    let fixedName = workingFileName.replace('/', ' slash ').replace("'", '');
    console.log(`Writing ./${OUT_DIR}/${fixedName}.md`);
    fs.writeFileSync(`./${OUT_DIR}/${prefix}${fixedName}.md`, `# ${workingFileName}\n${workingFileContent}`, 'utf8');
    indexedFiles.push(fixedName);
  }
}

function clearFile() {
  workingFileName = '';
  workingFileContent = '';
}

// Clear the `out/` dir and prepare output dirs
console.log("Cleaning old files...");
fs.rmdirSync(path.join(__dirname, OUT_DIR), {recursive: true});

console.log("Preparing output directories...");
fs.mkdirSync(path.join(__dirname, OUT_DIR, "spells"), {recursive: true});
fs.mkdirSync(path.join(__dirname, OUT_DIR, "creatures"), {recursive: true});
fs.mkdirSync(path.join(__dirname, OUT_DIR, "items"), {recursive: true});
fs.mkdirSync(path.join(__dirname, OUT_DIR, "monsters"), {recursive: true});

// Break out each top level header into its own file
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

// Write the last file left
writeCurrentFile();

// Fix up and move spell files into their directory
console.log('Fixing spell files...');
glob(`./${OUT_DIR}/Spells (*.md`, function(err, files) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  indexedFiles = [];
  clearFile();
  files.forEach(file => {
    console.log('Fixing', file);
    const fileContent = fs.readFileSync(file, 'utf8');
    let lines = fileContent.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.indexOf('#### ') === 0) {
        workingFileContent += '\n[[Spells]]';
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

    workingFileContent += '\n[[Spells]]';
    writeCurrentFile('spells/');

    fs.unlinkSync(file);
  });

  let indexContent = '# Spells\n';
  indexContent += indexedFiles.map(indexedFile => `- [[${indexedFile}]]`).join('\n');
  fs.writeFileSync(`./${OUT_DIR}/Spells.md`, indexContent, 'utf8');
});

// Fix up and move creautre files into their directory
console.log('Fixing creature files...');
glob(`./${OUT_DIR}/Creatures (*.md`, function(err, files) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  indexedFiles = [];
  clearFile();
  files.forEach(file => {
    console.log('Fixing', file);
    const fileContent = fs.readFileSync(file, 'utf8');
    let lines = fileContent.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.indexOf('## ') === 0) {
        workingFileContent += '\n[[Creatures]]';
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

    workingFileContent += '\n[[Creatures]]';
    writeCurrentFile('creatures/');

    fs.unlinkSync(file);
  });

  let indexContent = '# Creatures\n';
  indexContent += indexedFiles.map(indexedFile => `- [[${indexedFile}]]`).join('\n');
  fs.writeFileSync(`./${OUT_DIR}/Creatures.md`, indexContent, 'utf8');
});

// Fix up and move monster files into their directory
console.log('Fixing monster files...');
glob(`./${OUT_DIR}/Monsters (*.md`, function(err, files) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  indexedFiles = [];
  clearFile();
  files.forEach(file => {
    console.log('Fixing', file);
    const fileContent = fs.readFileSync(file, 'utf8');
    let lines = fileContent.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.indexOf('## ') === 0) {
        workingFileContent += '\n#[[Monsters]]';
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

    workingFileContent += '\n[[Monsters]]';
    writeCurrentFile('monsters/');

    fs.unlinkSync(file);
  });

  let indexContent = '# Monsters\n';
  indexContent += indexedFiles.map(indexedFile => `- [[${indexedFile}]]`).join('\n');
  fs.writeFileSync(`./${OUT_DIR}/Monsters.md`, indexContent, 'utf8');
});

// Fix up and move item files into their directory
console.log('Fixing item files...');
glob(`./${OUT_DIR}/Magic Items (*.md`, function(err, files) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  indexedFiles = [];
  clearFile();
  files.forEach(file => {
    console.log('Fixing', file);
    const fileContent = fs.readFileSync(file, 'utf8');
    let lines = fileContent.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.indexOf('### ') === 0) {
        workingFileContent += '\n[[Magic Items]]';
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

    workingFileContent += '\n[[Magic Items]]';
    writeCurrentFile('items/');

    fs.unlinkSync(file);
  });
  let indexContent = '# Magic Items\n';
  indexContent += indexedFiles.map(indexedFile => `- [[${indexedFile}]]`).join('\n');
  fs.writeFileSync(`./${OUT_DIR}/Magic Items.md`, indexContent, 'utf8');
});
