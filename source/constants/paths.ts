import {homedir} from 'os';
import {join} from 'path';

export const HOME_PATH = homedir();
export const CONFIGS_PATH = join(HOME_PATH, '.m-npmrc');
export const NPMRC_PATH = join(HOME_PATH, '.npmrc');
