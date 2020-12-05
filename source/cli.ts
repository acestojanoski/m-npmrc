#!/usr/bin/env node
import {existsSync, mkdirSync} from 'fs';
import meow from 'meow';
import Command from './types/command';
import print from './utils/print';
import {CONFIGS_PATH} from './constants/paths';
import add from './commands/add';
import list from './commands/list';
import remove from './commands/remove';
import use from './commands/use';
import edit from './commands/edit';

const cli = meow(`
Usage:
  $ m-npmrc <command>

Commands:
  add - add a new config
  remove - remove an existing config
  use - use an existing config
  list - list your configs
  edit - edit an existing config
`);

// create configs directory if doesn't exist
if (!existsSync(CONFIGS_PATH)) {
	mkdirSync(CONFIGS_PATH);
}

const command = cli.input[0] as Command;

switch (command) {
	case 'add':
		void add();
		break;

	case 'list':
		void list();
		break;

	case 'remove':
		void remove();
		break;

	case 'use':
		void use();
		break;

	case 'edit':
		void edit();
		break;

	default:
		print(cli.help);
}
