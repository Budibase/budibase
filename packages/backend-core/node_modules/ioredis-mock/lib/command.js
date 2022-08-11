"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isInSubscriberMode = isInSubscriberMode;
exports.isNotConnected = isNotConnected;
exports.throwIfInSubscriberMode = throwIfInSubscriberMode;
exports.throwIfNotConnected = throwIfNotConnected;
exports.throwIfCommandIsNotAllowed = throwIfCommandIsNotAllowed;
exports.processArguments = processArguments;
exports.processReply = processReply;
exports.safelyExecuteCommand = safelyExecuteCommand;
exports.default = command;

var _lodash = _interopRequireDefault(require("lodash"));

var _standardAsCallback = _interopRequireDefault(require("standard-as-callback"));

var _promiseContainer = _interopRequireDefault(require("./promise-container"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isInSubscriberMode(RedisMock) {
  if (RedisMock.channels === undefined) {
    return false;
  }

  return RedisMock.subscriberMode;
}

function isNotConnected(RedisMock) {
  if (RedisMock.connected === undefined) {
    return false;
  }

  return !RedisMock.connected;
}

function throwIfInSubscriberMode(commandName, RedisMock) {
  if (isInSubscriberMode(RedisMock)) {
    const allowedCommands = ['subscribe', 'psubscribe', 'unsubscribe', 'punsubscribe', 'ping', 'quit', 'disconnect'];

    if (allowedCommands.indexOf(commandName) > -1) {// command is allowed -> do not throw
    } else {
      throw new Error('Connection in subscriber mode, only subscriber commands may be used');
    }
  }
}

function throwIfNotConnected(commandName, RedisMock) {
  if (isNotConnected(RedisMock)) {
    if (commandName !== 'connect' && commandName !== 'defineCommand') {
      throw new Error("Stream isn't writeable and enableOfflineQueue options is false");
    }
  }
}

function throwIfCommandIsNotAllowed(commandName, RedisMock) {
  throwIfInSubscriberMode(commandName, RedisMock);
  throwIfNotConnected(commandName, RedisMock);
}
/**
 * Transform non-buffer arguments to strings to simulate real ioredis behavior
 * @param {any} arg the argument to transform
 */


const argMapper = arg => {
  if (arg === null || arg === undefined) return '';
  return arg instanceof Buffer ? arg : arg.toString();
};

function processArguments(args, commandName, RedisMock) {
  // fast return, the defineCommand command requires NO transformation of args
  if (commandName === 'defineCommand') return args;
  let commandArgs = args ? _lodash.default.flatten(args) : [];

  if (RedisMock.Command.transformers.argument[commandName]) {
    commandArgs = RedisMock.Command.transformers.argument[commandName](args);
  }

  commandArgs = commandArgs.map(argMapper);
  return commandArgs;
}

function processReply(result, commandName, RedisMock) {
  if (RedisMock.Command.transformers.reply[commandName]) {
    return RedisMock.Command.transformers.reply[commandName](result);
  }

  return result;
}

function safelyExecuteCommand(commandEmulator, commandName, RedisMock, ...commandArgs) {
  throwIfCommandIsNotAllowed(commandName, RedisMock);
  const result = commandEmulator(...commandArgs);
  return processReply(result, commandName, RedisMock);
}

function command(commandEmulator, commandName, RedisMock) {
  return (...args) => {
    const lastArgIndex = args.length - 1;
    let callback = args[lastArgIndex];

    if (typeof callback !== 'function') {
      callback = undefined;
    } else {
      // eslint-disable-next-line no-param-reassign
      args.length = lastArgIndex;
    }

    const commandArgs = processArguments(args, commandName, RedisMock);

    if (commandName === 'defineCommand') {
      return safelyExecuteCommand(commandEmulator, commandName, RedisMock, ...commandArgs);
    }

    const Promise = _promiseContainer.default.get();

    return (0, _standardAsCallback.default)(new Promise(resolve => resolve(safelyExecuteCommand(commandEmulator, commandName, RedisMock, ...commandArgs))), callback);
  };
}