import {existsSync} from 'fs';
import {join} from 'path';
import inquirer from 'inquirer';
import print from '../utils/print';
import {writeFile} from '../utils/fs-async';
import {CONFIGS_PATH} from '../constants/paths';
import {ERROR_MESSAGE} from '../constants/messages';

const add = async () => {
	try {
		const {name}: {name: string} = await inquirer.prompt([
			{
				type: 'text',
				name: 'name',
				message: 'Config name:',
			},
		]);

		const configPath = join(CONFIGS_PATH, name);

		if (existsSync(configPath)) {
			print.warn(`Config with name '${name}' exists.`);
			process.exit();
		}

		const {config} = await inquirer.prompt([
			{
				type: 'editor',
				name: 'config',
				message: 'Configuration',
				default: `# ${name}`,
			},
		]);

		await writeFile(join(CONFIGS_PATH, name), config);
		print.success(`\nAdded config: '${name}'\n`);
	} catch {
		print.error(ERROR_MESSAGE);
		process.exit(1);
	}
};

export default add;
