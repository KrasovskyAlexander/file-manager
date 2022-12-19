import { readdir } from 'node:fs/promises';
import path from 'path';
import { chdir, cwd } from 'node:process';

import { consoleSuccessfully, consoleError } from './logs.js';

export const up = (currentDir) =>  {
    try {
        chdir(path.resolve(currentDir, '..'))
        consoleSuccessfully(`New directory: ${cwd()}`);
    } catch (err) {
        consoleError(`chdir: ${err}`);
    }
}

export const cd = (path) =>  {
    try {
        chdir(path)
        consoleSuccessfully(`New directory: ${cwd()}`);
    } catch (err) {
        consoleError(`chdir: ${err}`);
    }
}

const checkType = (file) => file.isDirectory() ? 'directory' : file.isFile() ? 'file' : null

export const ls  = async (path) => {
    const files = await readdir(path, { withFileTypes: true });

    const sortedListFiles = files
        .map(file => ({ Name: file.name, Type: checkType(file) }))
        .filter(file => file.Type)
        .sort((a, b) => a.Type.localeCompare(b.Type))

    console.table(sortedListFiles);
}
