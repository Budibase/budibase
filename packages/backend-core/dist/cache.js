"use strict";
const generic = require("./src/cache/generic");
module.exports = Object.assign(Object.assign({ user: require("./src/cache/user"), app: require("./src/cache/appMetadata"), writethrough: require("./src/cache/writethrough") }, generic), { cache: generic });
//# sourceMappingURL=cache.js.map