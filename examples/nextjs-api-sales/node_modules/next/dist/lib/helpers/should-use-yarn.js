"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.shouldUseYarn = shouldUseYarn;
var _childProcess = require("child_process");
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function shouldUseYarn(baseDir) {
    try {
        const userAgent = process.env.npm_config_user_agent;
        if (userAgent) {
            return Boolean(userAgent && userAgent.startsWith('yarn'));
        } else {
            if (_fs.default.existsSync(_path.default.join(baseDir, 'yarn.lock'))) {
                return true;
            } else if (_fs.default.existsSync(_path.default.join(baseDir, 'package-lock.json'))) {
                return false;
            }
            (0, _childProcess).execSync('yarnpkg --version', {
                stdio: 'ignore'
            });
            return true;
        }
    } catch (e) {
        return false;
    }
}

//# sourceMappingURL=should-use-yarn.js.map