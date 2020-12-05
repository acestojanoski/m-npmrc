import {greenBright, redBright, yellowBright} from 'chalk';

const print = (...args: any[]) => console.info(...args);

print.success = (...args: any[]) => console.info(greenBright(...args));
print.error = (...args: any[]) => console.error(redBright(...args));
print.warn = (...args: any[]) => console.error(yellowBright(...args));

export default print;
