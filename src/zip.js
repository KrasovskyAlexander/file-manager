import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { createReadStream, createWriteStream } from 'node:fs';
import path from 'path';

import { consoleSuccessfully, consoleError } from './logs.js';
import { exists } from './utils.js';

export const compress = async (pathToFile, pathToNewFile) => {
    const isExistFile = await exists(pathToFile);
    const isExistDir = await exists(path.dirname(pathToNewFile));
    const isExistNewFile = await exists(pathToNewFile);

    if (!isExistFile || !isExistDir || isExistNewFile ) {
        consoleError('FS operation failed: file not exists or new file already exists or selected dir not exists');
        return;
    }

    const source = createReadStream(pathToFile);
    const destination = createWriteStream(path.resolve(pathToNewFile, 'archive.br'));

    const brotli = createBrotliCompress();

    const stream = source.pipe(brotli).pipe(destination);

    stream.on('finish', () => {
        consoleSuccessfully('Successfully done compressing');
    });
}



export const decompress = async (pathToFile, pathToNewFile) => {
    const isExistFile = await exists(pathToFile);
    const isExistDir = await exists(path.dirname(pathToNewFile));
    const isExistNewFile = await exists(pathToNewFile);

    if (!isExistFile || !isExistDir || isExistNewFile ) {
        consoleError('FS operation failed: file not exists or new file already exists or selected dir not exists');
        return;
    }

    const source = createReadStream(pathToFile);
    const destination = createWriteStream(pathToNewFile);

    const brotli = createBrotliDecompress();

    const stream = source.pipe(brotli).pipe(destination);

    stream.on('finish', () => {
        consoleSuccessfully('Successfully done decompressing');
    });

}