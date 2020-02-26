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

const homeDirectory = os.homedir();
const configurationsDirectory = path.join(os.tmpdir(), 'm-npmrc');

const cli = argsFlagify(`
	Usage
	  $ m-npmrc <input>

	Commands
	  new (create a new npmrc configuration)
	  use (use an existing npmrc configuration)
	  list (list your npmrc configurations)
	  remove (remove an existing npmrc configuration)

	Flags
	  --version (display the m-npmrc version)
	  --help (display the help text)

	Examples
	  $ m-npmrc new
	  $ m-npmrc use
	  $ m-npmrc list
	  $ m-npmrc remove
`);

if (!fs.existsSync(configurationsDirectory)) {
	fs.mkdirSync(configurationsDirectory);
}

const executeNew = async () => {
	const questions = [
		{
			type: 'text',
			name: 'configurationName',
			message: 'Enter a name for your npmrc configuration:',
		},
		{
			type: 'editor',
			name: 'newConfiguration',
			message: 'Write your configuration:',
		},
	];

	const {configurationName, newConfiguration} = await inquirer.prompt(
		questions
	);

	try {
		const configurationPath = path.join(
			configurationsDirectory,
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
		const configurationNames = await readdirAsync(configurationsDirectory);
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
		const choices = await readdirAsync(configurationsDirectory);

		if (choices.length === 0) {
			console.log('No configurations to remove.');
			process.exit();
		}

		const questions = [
			{
				type: 'list',
				name: 'configurationToRemove',
				message: 'Remove a configuration:',
				choices,
			},
		];

		const inputs = await inquirer.prompt(questions);
		const configurationPath = path.join(
			configurationsDirectory,
			inputs.configurationToRemove
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
		const choices = await readdirAsync(configurationsDirectory);

		if (choices.length === 0) {
			console.log('No configurations to use.');
			process.exit();
		}

		const questions = [
			{
				type: 'list',
				name: 'configurationToUse',
				message: 'Use a configuration:',
				choices,
			},
		];

		const inputs = await inquirer.prompt(questions);
		const sourcepath = path.join(
			configurationsDirectory,
			inputs.configurationToUse
		);
		const destinationPath = path.join(homeDirectory, '.npmrc');
		await copyFileAsync(sourcepath, destinationPath);
		console.log(`Using configuration: ${inputs.configurationToUse}`);
	} catch (error) {
		console.error(
			'An error occurred while switching the configuration. Please try again.'
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

	default:
		console.log(cli.help);
}
