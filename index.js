const fs = require('fs');
const path = require('path');
const glob = require('glob');

const OUT_DIR = 'reference';
const input = fs.readFileSync('./5e-srd-compiled-0-4-1.md', 'utf8');

const inputLines = input.split('\n');

let workingFileName = '';
let workingFileContent = '';
let indexedFiles = [];
let seenDruidClass = false;

function writeCurrentFile(prefix = '') {
  if (workingFileName.trim() !== '' && workingFileContent.trim() !== '' && workingFileName !== 'Licensing') {
    let fixedName = workingFileName.replace('/', ' slash ').replace("'", '');

    // There is a Druid class and Druid NPC type, differentiate them
    if (fixedName === 'Druid') {
      if (seenDruidClass) {
        fixedName = 'Druid (NPC)';
      } else {
        seenDruidClass = true;
      }
    }

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
  'Druid (NPC)',
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
  const oldLocation = path.join(__dirname, OUT_DIR, fileName);
  const newLocation = path.join(__dirname, OUT_DIR, 'npcs', fileName);
  fs.renameSync(oldLocation, newLocation);

  // Mark up the file with a backlink to NPCs.md
  const fileContent = fs.readFileSync(newLocation, 'utf8');

  const updatedContent = `${fileContent}\n[[NPCs]]`;
  fs.writeFileSync(newLocation, updatedContent, 'utf8');
});

// Write NPC.md
const npcFileList = NPC_FILES.map((file) => `- [[${file}]]`).join('\n');
const npcFileContent = `#NPCs\n\n${npcFileList}`;
fs.writeFileSync(path.join(__dirname, OUT_DIR, 'NPCs.md'), npcFileContent);

function breakDownAlphebetizedFiles(title, targetDir, titleBreak) {
  glob(`./${OUT_DIR}/${title} (*.md`, (err, files) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    const backlink = `[[${title}]]`;

    indexedFiles = [];
    clearFile();
    files.forEach((file) => {
      const fileContent = fs.readFileSync(file, 'utf8');
      const lines = fileContent.split('\n');

      for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i];

        if (line.indexOf(`${titleBreak} `) === 0) {
          workingFileContent += `\n${backlink}`;
          writeCurrentFile(`${targetDir}/`);
          clearFile();
          if (line.indexOf(': ') !== -1) {
            [, workingFileName] = line.split(': ');
          } else {
            workingFileName = line.replace(`${titleBreak} `, '');
          }
        } else if (line.indexOf('# ') === -1) {
          workingFileContent += `${line}\n`;
        }
      }

      if (workingFileContent.indexOf(backlink) === -1) {
        workingFileContent += `\n${backlink}`;
      }
      writeCurrentFile(`${targetDir}/`);

      fs.unlinkSync(file);
    });

    let indexContent = `# ${title}\n`;
    indexContent += indexedFiles.map((indexedFile) => `- [[${indexedFile}]]`).join('\n');
    fs.writeFileSync(`./${OUT_DIR}/${title}.md`, indexContent, 'utf8');
  });
}

breakDownAlphebetizedFiles('Spells', 'spells', '####');
breakDownAlphebetizedFiles('Creatures', 'creatures', '##');
breakDownAlphebetizedFiles('Monsters', 'monsters', '##');
breakDownAlphebetizedFiles('Magic Items', 'items', '###');

// Remove some unused files
fs.unlinkSync(path.join(__dirname, OUT_DIR, 'Miscellaneous Creatures\'.md'));
fs.unlinkSync(path.join(__dirname, OUT_DIR, 'Non-Player Characters\'.md'));
