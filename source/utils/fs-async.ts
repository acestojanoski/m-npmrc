import fs from 'fs';
import {promisify} from 'util';

export const writeFile = promisify(fs.writeFile);
export const readdir = promisify(fs.readdir);
export const unlink = promisify(fs.unlink);
export const copyFile = promisify(fs.copyFile);
export const readFile = promisify(fs.readFile);
