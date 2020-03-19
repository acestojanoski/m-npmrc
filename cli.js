#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const {promisify} = require('util');

const argsFlagify = require('args-flagify');
const inquirer = require('inquirer');

const writeFileAsync = promisify(fs.writeFile);
const readdirAsync = promisify(fs.readdir);
const unlinkAsync = promisify(fs.unlink);
const copyFileAsync = promisify(fs.copyFile);
const readFileAsync = promisify(fs.readFile);

const homeDirectoryPath = os.homedir();
const npmrcPath = path.join(homeDirectoryPath, '.npmrc');
const configurationsDirectoryPath = path.join(homeDirectoryPath, '.m-npmrc');

const cli = argsFlagify(`
	Usage:
	  $ m-npmrc <input>

	Commands:
	  new - create a new npmrc configuration
	  use - use an existing npmrc configuration
	  list - list your npmrc configurations
	  remove - remove an existing npmrc configuration
	  edit - edit an existing npmrc configuration

	Options:
	  --version - display the m-npmrc version
	  --help - display the help text

	Examples:
	  $ m-npmrc new
	  $ m-npmrc use
	  $ m-npmrc list
	  $ m-npmrc remove
	  $ m-npmrc edit
`);

if (!fs.existsSync(configurationsDirectoryPath)) {
	fs.mkdirSync(configurationsDirectoryPath);
}

const executeNew = async () => {
	const {configurationName} = await inquirer.prompt([
		{
			type: 'text',
			name: 'configurationName',
			message: 'Enter a name for your npmrc configuration:',
		},
	]);

	const {newConfiguration} = await inquirer.prompt([
		{
			type: 'editor',
			name: 'newConfiguration',
			message: 'Write your configuration:',
			default: `# ${configurationName}`,
		},
	]);

	try {
		const configurationPath = path.join(
			configurationsDirectoryPath,
			configurationName
		);

		await writeFileAsync(configurationPath, newConfiguration);
		console.log(`npmrc configuration saved as: ${configurationName}`);
	} catch (error) {
		console.error(
			'An error occurred while saving the configuration. Please try again.'
		);
	}
};

const executeList = async () => {
	try {
		const configurationNames = await readdirAsync(
			configurationsDirectoryPath
		);
		configurationNames.forEach(configurationName =>
			console.log(configurationName)
		);
	} catch (error) {
		console.error(
			'An error occurred while listing the configurations. Please try again.'
		);
	}
};

const executeRemove = async () => {
	try {
		const choices = await readdirAsync(configurationsDirectoryPath);

		if (choices.length === 0) {
			console.log('No configurations to remove.');
			process.exit();
		}

		const {configurationToRemove} = await inquirer.prompt([
			{
				type: 'list',
				name: 'configurationToRemove',
				message: 'Remove a configuration:',
				choices,
			},
		]);

		const configurationPath = path.join(
			configurationsDirectoryPath,
			configurationToRemove
		);

		await unlinkAsync(configurationPath);
		console.log('Configuration removed successfully.');
	} catch (error) {
		console.error(
			'An error occurred while removing the configuration. Please try again.'
		);
	}
};

const executeUse = async () => {
	try {
		const choices = await readdirAsync(configurationsDirectoryPath);

		if (choices.length === 0) {
			console.log('No configurations to use.');
			process.exit();
		}

		const {configurationToUse} = await inquirer.prompt([
			{
				type: 'list',
				name: 'configurationToUse',
				message: 'Use a configuration:',
				choices,
			},
		]);

		const configurationPath = path.join(
			configurationsDirectoryPath,
			configurationToUse
		);

		await copyFileAsync(configurationPath, npmrcPath);
		console.log(`Using configuration: ${configurationToUse}`);
	} catch (error) {
		console.error(
			'An error occurred while switching the configuration. Please try again.'
		);
	}
};

const executeEdit = async () => {
	try {
		const choices = await readdirAsync(configurationsDirectoryPath);

		if (choices.length === 0) {
			console.log('No configurations to use.');
			process.exit();
		}

		const {configurationToEdit} = await inquirer.prompt([
			{
				type: 'list',
				name: 'configurationToEdit',
				message: 'Edit a configuration:',
				choices,
			},
		]);

		const configurationPath = path.join(
			configurationsDirectoryPath,
			configurationToEdit
		);

		const oldConfiguration = await readFileAsync(configurationPath);

		const {editedConfiguration} = await inquirer.prompt([
			{
				type: 'editor',
				name: 'editedConfiguration',
				message: 'Edit',
				default: oldConfiguration,
			},
		]);

		await writeFileAsync(configurationPath, editedConfiguration);

		const npmrc = await readFileAsync(npmrcPath);

		if (Buffer.compare(npmrc, oldConfiguration) === 0) {
			await copyFileAsync(configurationPath, npmrcPath);
		}

		console.log('Configuration edited successfully.');
	} catch (error) {
		console.error(
			'An error occurred while editing the configuration. Please try again.'
		);
	}
};

const command = cli.inputs[0];

switch (command) {
	case 'new':
		executeNew();
		break;

	case 'use':
		executeUse();
		break;

	case 'list':
		executeList();
		break;

	case 'remove':
		executeRemove();
		break;

	case 'edit':
		executeEdit();
		break;

	default:
		console.log(cli.help);
}
