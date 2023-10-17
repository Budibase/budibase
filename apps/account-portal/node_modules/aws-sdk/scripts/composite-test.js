const {execute, executeLongProcess} = require('./lib/test-helper');

async function run() {
  const EXEC = {
    'execute': execute,
    'executeLongProcess': executeLongProcess,
  }
  const scripts = [
    { execute: 'executeLongProcess', command: ['npm', 'run', 'helper-test'], retryCount: 1 },
    { execute: 'executeLongProcess', command: ['npm', 'run', 'lint']},
    { execute: 'executeLongProcess', command: ['npm', 'run', 'coverage'] },
    { execute: 'executeLongProcess', command: ['npm', 'run', 'buildertest'] },
    { execute: 'executeLongProcess', command: ['npm', 'run', 'tstest'] },
    { execute: 'executeLongProcess', command: ['npm', 'run', 'region-check'] },
    { execute: 'executeLongProcess', command: ['npm', 'run', 'translate-api-test'] },
    { execute: 'executeLongProcess', command: ['npm', 'run', 'typings-generator-test'] },
    { execute: 'executeLongProcess', command: ['npm', 'run', 'browsertest'] },
    { execute: 'executeLongProcess', command: ['npm', 'run', 'react-native-test'] },
    { execute: 'executeLongProcess', command: ['npm', 'run', 'csm-functional-test'] }
  ];
  for (const { execute, command, execOptions, retryCount } of scripts) {
    try {
      await EXEC[execute](command, execOptions, retryCount);
    } catch (error) {
      throw error;
    }
  }
}

(async () => {
  try {
    await run();
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();
