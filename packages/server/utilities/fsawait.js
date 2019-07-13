const util = require("util");
const fs = require("fs");

module.exports.readFile = util.promisify(fs.readFile);
module.exports.writeFile = util.promisify(fs.writeFile);
module.exports.rimraf = util.promisify(require("rimraf"));
module.exports.mkdir = util.promisify(fs.mkdir);
module.exports.unlink = util.promisify(fs.unlink);
module.exports.stat = util.promisify(fs.stat);
module.exports.exists = async (path) => {
    try {
        await util.promisify(fs.access)(
            path
        );       
    } catch (e) {
        return false;
    }
    return true;
};

