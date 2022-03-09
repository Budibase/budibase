"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
class SimpleWebpackError extends Error {
    constructor(file, message){
        super(message);
        this.file = file;
    }
}
exports.SimpleWebpackError = SimpleWebpackError;

//# sourceMappingURL=simpleWebpackError.js.map