import os from 'os';

export const getRootDir = () => os.homedir();

export const getEOL = () => JSON.stringify(os.EOL);

export const getCpus = () => os.cpus();

export const getOsUsername = () => os.userInfo().username;

export const getArch = () => os.arch();