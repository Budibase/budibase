const { exec, spawn } = require('child_process');

/**
 * wrap child_process.exec with retry. Will throw immediately when return
 * code not 0; Used for trivial commands since error detail won't be printed.
 * @param {string} command 
 * @param {structure} execOptoins 
 * @param {number} retryCount 
 */
async function executeCommand(command, execOptoins = {}, retryCount = 1) {
  try {
    const execCommand = command.join(' ');
    const { stderr, stdout } = await execute(execCommand, execOptoins);
    if (stderr) process.stderr.write(stderr.toString());
    if (stdout) process.stderr.write(stdout.toString());
  } catch (error) {
    if (retryCount > 0) {
      await executeCommand(command, execOptoins, --retryCount);
    } else {
      throw error;
    }
  }
}

function execute(command, options) {
  return new Promise((resolve, reject) => {
    exec(command, options, (err, stdout, stderr) => {
      if (err) {
          reject(err);
      } else {
          resolve({
              stdout: stdout,
              stderr: stderr
          });
      }
  });
  })
}

/**
 * wrap child_process.spawn with retry
 * @param {string} command 
 * @param {structure} execOptions 
 * @param {number} retryCount 
 */
async function executeLongProcessCommand(command, execOptions = {}, retryCount = 1) {
  try {
    const firstCommand = command[0];
    const options = command.slice(1);
    await promisifiedSpawn(firstCommand, options, execOptions);
  } catch (error) {
    if (retryCount > 0) {
      await executeLongProcessCommand(command, execOptions, --retryCount);
    } else {
      throw error;
    }
  }
}

function promisifiedSpawn(command, options, execOptions) {
  return new Promise((resolve, reject) => {
    const subProcess = spawn(command, options, execOptions);
    subProcess.stdout.on('data', (data) => {
      process.stdout.write(data.toString());
    });
    subProcess.stderr.on('data', (data) => {
      process.stderr.write(data.toString());
    });
    subProcess.on('error', (err) => {
      console.error('spawn error: ', err);
    });
    subProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`"${command} ${options.join(' ')}" exited with code: ${code}`);
      }
    });
  });
}

module.exports = {
  execute: executeCommand,
  executeLongProcess: executeLongProcessCommand,
}