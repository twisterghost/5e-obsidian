const fs = require('fs');
const path = require('path');
const glob = require('glob');

const OUT_DIR = 'reference';
const input = fs.readFileSync('./5e-srd-compiled-0-4-1.md', 'utf8');

const inputLines = input.split('\n');

let workingFileName = '';
let workingFileContent = '';
let indexedFiles = [];

function writeCurrentFile(prefix = '') {
  if (workingFileName.trim() !== '' && workingFileContent.trim() !== '' && workingFileName !== 'Licensing') {
    const fixedName = workingFileName.replace('/', ' slash ').replace("'", '');
    fs.writeFileSync(`./${OUT_DIR}/${prefix}${fixedName}.md`, `# ${workingFileName}\n${workingFileContent}`, 'utf8');
    indexedFiles.push(fixedName);
  }
}

function clearFile() {
  workingFileName = '';
  workingFileContent = '';
}

// Clear the `out/` dir and prepare output dirs
fs.rmdirSync(path.join(__dirname, OUT_DIR), { recursive: true });
fs.mkdirSync(path.join(__dirname, OUT_DIR, 'spells'), { recursive: true });
fs.mkdirSync(path.join(__dirname, OUT_DIR, 'creatures'), { recursive: true });
fs.mkdirSync(path.join(__dirname, OUT_DIR, 'items'), { recursive: true });
fs.mkdirSync(path.join(__dirname, OUT_DIR, 'monsters'), { recursive: true });
fs.mkdirSync(path.join(__dirname, OUT_DIR, 'npcs'), { recursive: true });

// Break out each top level header into its own file
for (let i = 0; i < inputLines.length; i += 1) {
  const line = inputLines[i];

  if (line.indexOf('# ') === 0) {
    writeCurrentFile();
    clearFile();
    if (line.indexOf(': ') !== -1) {
      [, workingFileName] = line.split(': ');
    } else {
      workingFileName = line.replace('# ', '');
    }
  } else {
    workingFileContent += `${line}\n`;
  }
}

// Write the last file left
writeCurrentFile();

// There's a handful of files that categorize into the "NPCs" dir
const NPC_FILES = [
  'Acolyte',
  'Archmage',
  'Assassin',
  'Bandit',
  'Bandit Captain',
  'Berserker',
  'Commoner',
  'Cultist',
  'Cult Fanatic',
  'Druid',
  'Gladiator',
  'Guard',
  'Knight',
  'Mage',
  'Noble',
  'Priest',
  'Scout',
  'Spy',
  'Thug',
  'Tribal Warrior',
  'Veteran',
];
NPC_FILES.forEach((file) => {
  const fileName = `${file}.md`;
  const oldLocation = path.join(__dirname, 'reference', fileName);
  const newLocation = path.join(__dirname, 'reference', 'npcs', fileName);
  fs.renameSync(oldLocation, newLocation);
});

// Fix up and move spell files into their directory
glob(`./${OUT_DIR}/Spells (*.md`, (err, files) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  indexedFiles = [];
  clearFile();
  files.forEach((file) => {
    const fileContent = fs.readFileSync(file, 'utf8');
    const lines = fileContent.split('\n');

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];

      if (line.indexOf('#### ') === 0) {
        workingFileContent += '\n[[Spells]]';
        writeCurrentFile('spells/');
        clearFile();
        if (line.indexOf(': ') !== -1) {
          [, workingFileName] = line.split(': ');
        } else {
          workingFileName = line.replace('#### ', '');
        }
      } else {
        workingFileContent += `${line}\n`;
      }
    }

    workingFileContent += '\n[[Spells]]';
    writeCurrentFile('spells/');

    fs.unlinkSync(file);
  });

  let indexContent = '# Spells\n';
  indexContent += indexedFiles.map((indexedFile) => `- [[${indexedFile}]]`).join('\n');
  fs.writeFileSync(`./${OUT_DIR}/Spells.md`, indexContent, 'utf8');
});

// Fix up and move creautre files into their directory
glob(`./${OUT_DIR}/Creatures (*.md`, (err, files) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  indexedFiles = [];
  clearFile();
  files.forEach((file) => {
    const fileContent = fs.readFileSync(file, 'utf8');
    const lines = fileContent.split('\n');

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];

      if (line.indexOf('## ') === 0) {
        workingFileContent += '\n[[Creatures]]';
        writeCurrentFile('creatures/');
        clearFile();
        if (line.indexOf(': ') !== -1) {
          [, workingFileName] = line.split(': ');
        } else {
          workingFileName = line.replace('## ', '');
        }
      } else {
        workingFileContent += `${line}\n`;
      }
    }

    workingFileContent += '\n[[Creatures]]';
    writeCurrentFile('creatures/');

    fs.unlinkSync(file);
  });

  let indexContent = '# Creatures\n';
  indexContent += indexedFiles.map((indexedFile) => `- [[${indexedFile}]]`).join('\n');
  fs.writeFileSync(`./${OUT_DIR}/Creatures.md`, indexContent, 'utf8');
});

// Fix up and move monster files into their directory
glob(`./${OUT_DIR}/Monsters (*.md`, (err, files) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  indexedFiles = [];
  clearFile();
  files.forEach((file) => {
    const fileContent = fs.readFileSync(file, 'utf8');
    const lines = fileContent.split('\n');

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];

      if (line.indexOf('## ') === 0) {
        workingFileContent += '\n#[[Monsters]]';
        writeCurrentFile('monsters/');
        clearFile();
        if (line.indexOf(': ') !== -1) {
          [, workingFileName] = line.split(': ');
        } else {
          workingFileName = line.replace('## ', '');
        }
      } else {
        workingFileContent += `${line}\n`;
      }
    }

    workingFileContent += '\n[[Monsters]]';
    writeCurrentFile('monsters/');

    fs.unlinkSync(file);
  });

  let indexContent = '# Monsters\n';
  indexContent += indexedFiles.map((indexedFile) => `- [[${indexedFile}]]`).join('\n');
  fs.writeFileSync(`./${OUT_DIR}/Monsters.md`, indexContent, 'utf8');
});

// Fix up and move item files into their directory
glob(`./${OUT_DIR}/Magic Items (*.md`, (err, files) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  indexedFiles = [];
  clearFile();
  files.forEach((file) => {
    const fileContent = fs.readFileSync(file, 'utf8');
    const lines = fileContent.split('\n');

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];

      if (line.indexOf('### ') === 0) {
        workingFileContent += '\n[[Magic Items]]';
        writeCurrentFile('items/');
        clearFile();
        if (line.indexOf(': ') !== -1) {
          [, workingFileName] = line.split(': ');
        } else {
          workingFileName = line.replace('### ', '');
        }
      } else {
        workingFileContent += `${line}\n`;
      }
    }

    workingFileContent += '\n[[Magic Items]]';
    writeCurrentFile('items/');

    fs.unlinkSync(file);
  });
  let indexContent = '# Magic Items\n';
  indexContent += indexedFiles.map((indexedFile) => `- [[${indexedFile}]]`).join('\n');
  fs.writeFileSync(`./${OUT_DIR}/Magic Items.md`, indexContent, 'utf8');
});
