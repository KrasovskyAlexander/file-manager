import { createHash } from 'crypto'
import { readFile } from 'node:fs/promises';

import { exists } from './utils.js'
import { consoleError } from './logs.js'

export const calculateHash = async (path) => {
    try {
        const isExist = await exists(path);

        if (!isExist) {
            consoleError('file not exists');
            return;
        }

        const text = await readFile(path, { encoding: 'utf8' });
        const hash = createHash('sha256').update(text).digest('hex');

        console.log('hash:', hash);
    } catch (error) {
        consoleError(error);
    }
};
