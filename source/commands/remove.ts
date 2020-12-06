import {join} from 'path';
import inquirer from 'inquirer';
import print from '../utils/print';
import {ERROR_MESSAGE} from '../constants/messages';
import {CONFIGS_PATH} from '../constants/paths';
import {readdir, unlink} from '../utils/fs-async';

const remove = async () => {
	try {
		const choices = await readdir(CONFIGS_PATH);

		if (choices.length === 0) {
			print.warn('\nNo configs to remove.\n');
			process.exit();
		}

		const {name}: {name: string} = await inquirer.prompt([
			{
				type: 'list',
				name: 'name',
				message: 'Remove config:',
				choices,
			},
		]);

		await unlink(join(CONFIGS_PATH, name));
		print.success(`\nRemoved config: '${name}'\n`);
	} catch {
		print.error(ERROR_MESSAGE);
		process.exit(1);
	}
};

export default remove;
