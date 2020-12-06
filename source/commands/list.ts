import {cyan, yellowBright} from 'chalk';
import {readdir} from '../utils/fs-async';
import print from '../utils/print';
import {CONFIGS_PATH} from '../constants/paths';
import {ERROR_MESSAGE} from '../constants/messages';

const list = async () => {
	try {
		const configs = await readdir(CONFIGS_PATH);

		print('\nConfig list:\n');

		configs?.forEach((config, index) => {
			const striped = index % 2 === 0 ? cyan : yellowBright;
			print(striped(config));

			if (index === configs.length - 1) {
				print('\n');
			}
		});
	} catch {
		print.error(ERROR_MESSAGE);
		process.exit(1);
	}
};

export default list;
