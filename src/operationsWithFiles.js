

import { createReadStream, createWriteStream } from 'node:fs';
import { writeFile, rename, rm } from 'node:fs/promises';
import path from 'path';

 import { exists } from './utils.js';
 import { consoleSuccessfully, consoleError } from './logs.js';

export const readFile = async (path) => {
    const isExist = await exists(path);
    
    if (!isExist) {
        consoleError('FS operation failed: file not exists');
        return;
    }

    const readableStream = createReadStream(path, 'utf8');
    
    return new Promise((resolve) => {
        readableStream.on('data', chunk => {
            resolve(consoleSuccessfully(`${chunk}`));
        });
    });
};

export const createFile = async (path) => {
    try {
        const isExist = await exists(path);

        if (isExist) {
            consoleError('FS operation failed: file already exists');
            return;
        }

        await writeFile(path, '');
        consoleSuccessfully('Successfully create empty file');
    } catch (error) {
        consoleError(error)
    }
};



export const renameFile = async (pathToFile, newFileName) => {
    try {
        const dirname = path.dirname(pathToFile);
        const fileName = path.basename(pathToFile);
        const pathToNewFile = path.resolve(dirname, newFileName);

        const isExistFile = await exists(pathToFile);
        const isExistNewFile = await exists(pathToNewFile);

        if (!isExistFile || isExistNewFile) {
            consoleError('FS operation failed: file not exists or new file already exists');
            return;
        }

        await rename(pathToFile, newFileName);
        consoleSuccessfully(`Successfully rename file ${fileName} to ${newFileName}`);
    } catch (error) {
        consoleError(error)
    }
};

export const copyFile = async (pathToFile, pathToNewFile, reuse = false) => {
    try {
        const isExistFile = await exists(pathToFile);
        const isExistDir = await exists(path.dirname(pathToNewFile));
        const isExistNewFile = await exists(pathToNewFile);

        if (!isExistFile || !isExistDir || isExistNewFile ) {
            consoleError('FS operation failed: file not exists or new file already exists or selected dir not exists');
            return;
        }

        const readableStream = createReadStream(pathToFile);
        const writableStream = createWriteStream(pathToNewFile);

        readableStream.pipe(writableStream);
        if(!reuse) consoleSuccessfully(`Successfully copy file ${pathToFile} to ${pathToNewFile}`);
    } catch (error) {
        consoleError(error)
    }
};

export const deleteFile = async (path, reuse = false) => {
    try {
        const isExist = await exists(path);

        if (!isExist) {
            consoleError('FS operation failed: file not exists');
            return;
        }

        await rm(path);
        if(!reuse) consoleSuccessfully('Successfully remove file');
    } catch (error) {
        consoleError(error)
    }
};

export const moveFile = async (pathToFile, pathToNewFile) => {
    try {
        await copyFile(pathToFile, pathToNewFile, true);
        await deleteFile(pathToFile, true)
        consoleSuccessfully(`Successfully move file from ${pathToFile} to ${pathToNewFile}`);
    } catch (error) {
        consoleError(error)
    }
};


