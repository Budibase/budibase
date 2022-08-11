"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Processor {
    constructor(processors) {
        this.initialised = false;
        this.processors = [];
        this.processors = processors;
    }
    processEvent(event, identity, properties, timestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const eventProcessor of this.processors) {
                yield eventProcessor.processEvent(event, identity, properties, timestamp);
            }
        });
    }
    identify(identity, timestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const eventProcessor of this.processors) {
                yield eventProcessor.identify(identity, timestamp);
            }
        });
    }
    identifyGroup(identity, timestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const eventProcessor of this.processors) {
                yield eventProcessor.identifyGroup(identity, timestamp);
            }
        });
    }
    shutdown() {
        for (const eventProcessor of this.processors) {
            eventProcessor.shutdown();
        }
    }
}
exports.default = Processor;
//# sourceMappingURL=Processors.js.map