# m-npmrc

[![CI](https://github.com/acestojanoski/m-npmrc/workflows/CI/badge.svg)](https://github.com/acestojanoski/m-npmrc/actions?query=workflow%3ACI)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![install size](https://packagephobia.now.sh/badge?p=m-npmrc)](https://packagephobia.now.sh/result?p=m-npmrc)
[![Downloads](https://img.shields.io/npm/dm/m-npmrc.svg)](https://npmjs.com/m-npmrc)

> Manage multiple .npmrc configurations

The easy way to manage multiple `.npmrc` configurations on a single machine.

## Install

```
$ npm install -g m-npmrc
```
or
```
$ yarn global add m-npmrc
```

## Usage

```sh
Usage:
  $ m-npmrc <command>

Commands:
  add - add a new config
  remove - remove an existing config
  use - use an existing config
  list - list your configs
  edit - edit an existing config
```

> NOTE: When you edit a configuration which is currently in use, the `.npmrc` file will be automatically updated

## LICENSE

[MIT](./LICENSE)
