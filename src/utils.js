import fsPromises from 'node:fs/promises';

export const getUsername = (argv) => {
    const user = argv.find(arg => arg.match('--username'));
    if(!user) return null
    return user.split('=')[1] || null;
}

export const exists = async (path) => {  
    try {
        await fsPromises.access(path)
        return true
    } catch {
        return false
    }
};

export const splitCommand = (command) => {
    return {
        commandName: command.split(' ')[0],
        commandArgument: [...command.split(' ')].slice(1)
    }
};
