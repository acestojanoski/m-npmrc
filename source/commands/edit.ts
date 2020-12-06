import {join} from 'path';
import inquirer from 'inquirer';
import {ERROR_MESSAGE} from '../constants/messages';
import {CONFIGS_PATH, NPMRC_PATH} from '../constants/paths';
import {copyFile, readdir, readFile, writeFile} from '../utils/fs-async';
import print from '../utils/print';

const edit = async () => {
	try {
		const choices = await readdir(CONFIGS_PATH);

		if (choices.length === 0) {
			print.warn('\nNo configs to edit.\n');
			process.exit();
		}

		const {name}: {name: string} = await inquirer.prompt([
			{
				type: 'list',
				name: 'name',
				message: 'Edit config:',
				choices,
			},
		]);

		const configPath = join(CONFIGS_PATH, name);
		const oldConfig = await readFile(configPath);

		const {newConfig} = await inquirer.prompt([
			{
				type: 'editor',
				name: 'newConfig',
				message: 'Edit',
				default: oldConfig,
			},
		]);

		await writeFile(configPath, newConfig);

		try {
			const npmrc = await readFile(NPMRC_PATH);

			if (Buffer.compare(npmrc, oldConfig) === 0) {
				void copyFile(configPath, NPMRC_PATH);
			}
		} catch {
			print.warn(
				'The edited config was not synced with the .npmrc file.'
			);
		}

		print.success(`\nEdited config: '${name}'\n`);
	} catch {
		print.error(ERROR_MESSAGE);
		process.exit(1);
	}
};

export default edit;
