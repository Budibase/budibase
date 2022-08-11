#!/usr/bin/env node
'use strict';
var es3ify = require('es3ify');
return process.stdin.pipe(es3ify()).pipe(process.stdout);
