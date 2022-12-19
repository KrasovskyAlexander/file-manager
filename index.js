import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { chdir, cwd } from 'node:process';
import path from 'path';

import { splitCommand, getUsername } from './src/utils.js';
import { consoleSuccessfully, consoleError } from './src/logs.js';
import { up, ls, cd } from './src/nwd.js'
import { readFile, createFile, renameFile, copyFile, moveFile, deleteFile } from './src/operationsWithFiles.js'
import { calculateHash } from './src/hash.js';
import { getRootDir, getEOL, getCpus, getOsUsername, getArch } from './src/operatingSystem.js'
import { compress, decompress } from './src/zip.js';

const rl = readline.createInterface({ input, output });

const main = () => {
    chdir(getRootDir());
    let currentDir = cwd();
    const userName = getUsername(process.argv);

    if (!userName) {
        rl.close();
        return consoleError('Please write you username. Or maybe you use powershell, pls use bash or etc');
    }

    consoleSuccessfully(`Welcome to the File Manager, ${userName}!`);
    
    rl.setPrompt(`\x1b[36mYou are currently in ${currentDir}>\x1b[0m \n`);
    rl.prompt();
    
    rl.on('line', async (line) => {
        let isNeedPrompt = true;
        let pathToFile = '';
        const { commandName, commandArgument} = splitCommand(line);
        switch (commandName) {
            case 'ls': 
                await ls(currentDir);
                break;
            case 'up': 
                up(currentDir);
                currentDir = cwd();
                break;
            case 'cd': 
                pathToFile = path.resolve(currentDir, commandArgument[0]);
                cd(pathToFile);
                currentDir = cwd();
                break;
            case 'cat': 
                pathToFile = path.resolve(currentDir, commandArgument[0]);
                await readFile(pathToFile);
                break;
            case 'add': 
                pathToFile = path.resolve(currentDir, commandArgument[0]);
                await createFile(pathToFile);
                break;
            case 'rn': 
                pathToFile = path.resolve(currentDir, commandArgument[0]);
                await renameFile(pathToFile, commandArgument[1]);
                break;
            case 'cp': {
                pathToFile = path.resolve(currentDir, commandArgument[0]);
                const fileName = path.basename(pathToFile);
                const pathToNewFile = path.resolve(currentDir, commandArgument[1], fileName);
                await copyFile(pathToFile, pathToNewFile);
                break;
            }
            case 'mv': {
                pathToFile = path.resolve(currentDir, commandArgument[0]);
                const fileName = path.basename(pathToFile);
                const pathToNewFile = path.resolve(currentDir, commandArgument[1], fileName);
                await moveFile(pathToFile, pathToNewFile);
                break;
            }
            case 'rm': 
                pathToFile = path.resolve(currentDir, commandArgument[0]);
                await deleteFile(pathToFile);
                break;
            case 'hash': 
                pathToFile = path.resolve(currentDir, commandArgument[0]);
                await calculateHash(pathToFile);
                break;
            case 'os':
                switch (commandArgument[0]) {
                    case '--EOL': 
                        console.log('EOL:', getEOL());
                        break;
                    case '--cpus': 
                        console.log(getCpus());
                        break;
                    case '--homedir': 
                        console.log(getRootDir());
                        break;
                    case '--username': 
                        console.log(getOsUsername());
                        break;
                    case '--architecture': 
                        console.log(getArch());
                        break;
                    default: 
                        consoleError('Wrong os command')
                        break;
                }
                break;
            case 'compress': {    // Brotli-compressed files are usually identified by . br extension                                         
                pathToFile = path.resolve(currentDir, commandArgument[0]);   // example (compress test.txt Documents/archive.br)
                const pathToNewFile = path.resolve(currentDir, commandArgument[1]);
                await compress(pathToFile, pathToNewFile);
                break;
            };
            case 'decompress': { 
                pathToFile = path.resolve(currentDir, commandArgument[0]);  //example (decompress Documents/archive.br Downloads/test.txt)
                const pathToNewFile = path.resolve(currentDir, commandArgument[1]);
                await decompress(pathToFile, pathToNewFile);
                break;
            }
            case '.exit': 
                isNeedPrompt = false;
                rl.close();
                break;
            default: 
                isNeedPrompt = false;
                consoleError('Wrong command');
                break;
        }

        if (isNeedPrompt) {
            rl.setPrompt(`\x1b[36mYou are currently in ${currentDir}>\x1b[0m \n`);
            rl.prompt()
        };
    })

   
    rl.on('close', () => {
        consoleSuccessfully(`Thank you for using File Manager, ${userName}, goodbye!`);
    });
}

main();
