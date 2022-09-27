/*
  @license
	Rollup.js v2.79.0
	Wed, 31 Aug 2022 04:52:13 GMT - commit 8477f8ff1fe80086556021542b22942ad27a0a69

	https://github.com/rollup/rollup

	Released under the MIT License.
*/
'use strict';

require('path');
require('process');
require('url');
const loadConfigFile_js = require('./shared/loadConfigFile.js');
require('./shared/rollup.js');
require('./shared/mergeOptions.js');
require('tty');
require('perf_hooks');
require('crypto');
require('fs');
require('events');



module.exports = loadConfigFile_js.loadAndParseConfigFile;
//# sourceMappingURL=loadConfigFile.js.map
