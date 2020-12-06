import {join} from 'path';
import inquirer from 'inquirer';
import {readdir, copyFile} from '../utils/fs-async';
import print from '../utils/print';
import {ERROR_MESSAGE} from '../constants/messages';
import {CONFIGS_PATH, NPMRC_PATH} from '../constants/paths';

const use = async () => {
	try {
		const choices = await readdir(CONFIGS_PATH);

		if (choices.length === 0) {
			print.warn('\nNo configs to use.\n');
			process.exit();
		}

		const {name}: {name: string} = await inquirer.prompt([
			{
				type: 'list',
				name: 'name',
				message: 'Use config:',
				choices,
			},
		]);

		await copyFile(join(CONFIGS_PATH, name), NPMRC_PATH);
		print.success(`\nUsing config: '${name}'\n`);
	} catch {
		print.error(ERROR_MESSAGE);
		process.exit(1);
	}
};

export default use;
