/* eslint-disable dot-notation */
require('dotenv').config();

const execShellCommand = require('../src/Infrastructures/utils/ExecShellCommand');

module.exports = async () => {
  try {
    process.env['DATABASE_URL'] = process.env['DATABASE_URL_TEST'];
    await execShellCommand('npm run db:migrate:dev');
  } catch (err) {
    process.exit();
  }
};
