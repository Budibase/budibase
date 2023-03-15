"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputHandler = void 0;
const Rx = __importStar(require("rxjs"));
const operators_1 = require("rxjs/operators");
const defaults = __importStar(require("../defaults"));
/**
 * Sends input from concurrently through to commands.
 *
 * Input can start with a command identifier, in which case it will be sent to that specific command.
 * For instance, `0:bla` will send `bla` to command at index `0`, and `server:stop` will send `stop`
 * to command with name `server`.
 *
 * If the input doesn't start with a command identifier, it is then always sent to the default target.
 */
class InputHandler {
    constructor({ defaultInputTarget, inputStream, pauseInputStreamOnFinish, logger, }) {
        this.logger = logger;
        this.defaultInputTarget = defaultInputTarget || defaults.defaultInputTarget;
        this.inputStream = inputStream;
        this.pauseInputStreamOnFinish = pauseInputStreamOnFinish !== false;
    }
    handle(commands) {
        const { inputStream } = this;
        if (!inputStream) {
            return { commands };
        }
        Rx.fromEvent(inputStream, 'data')
            .pipe((0, operators_1.map)((data) => String(data)))
            .subscribe((data) => {
            const dataParts = data.split(/:(.+)/);
            const targetId = dataParts.length > 1 ? dataParts[0] : this.defaultInputTarget;
            const input = dataParts[1] || data;
            const command = commands.find((command) => command.name === targetId ||
                command.index.toString() === targetId.toString());
            if (command && command.stdin) {
                command.stdin.write(input);
            }
            else {
                this.logger.logGlobalEvent(`Unable to find command ${targetId}, or it has no stdin open\n`);
            }
        });
        return {
            commands,
            onFinish: () => {
                if (this.pauseInputStreamOnFinish) {
                    // https://github.com/kimmobrunfeldt/concurrently/issues/252
                    inputStream.pause();
                }
            },
        };
    }
}
exports.InputHandler = InputHandler;
