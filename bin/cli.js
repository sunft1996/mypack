#!/usr/bin/env node
const { program } = require('commander');
const pkg = require('../package.json');

class Cli {
  constructor() {
    this.program = program;
  }

  run() {
    this.program
      .name('mypack')
      .version(pkg.version, '-v, --version');
    const buildCommand = {
      name: 'build',
      noHelp: false,
      hidden: false,
      isDefault: true,
    };
    const buildAction = () => {
      console.log('[mypack info]: MyPack is starting...');
      require('../src/index');
    };
    this.makeCommand(buildCommand, {}, buildAction);
    this.program.parse(process.argv);
  }

  /**
   * @param {*} commandInfo
   * @param {*} options
   * @param {*} action
   * @returns {*}
   */
  makeCommand(commandInfo, options, action) {
    const command = this.program.command(commandInfo.name, {
      noHelp: commandInfo.noHelp,
      hidden: commandInfo.hidden,
      isDefault: commandInfo.isDefault,
    });
    command.description('build modules');
    command.action(action);
  }
}

module.exports = Cli;

const cli = new Cli();
cli.run();
