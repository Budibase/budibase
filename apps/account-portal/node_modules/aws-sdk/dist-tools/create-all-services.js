#!/usr/bin/env node

var path = require('path');

/*
 * Pass optional path to target directory as command line argument.
 *
 * The directory must include the apis/ folder and service customizations at
 * `lib/services`. Clients will be generated in `clients/`.
 *
 * If parameter is not passed the repository root will be used.
 */

var ClientCreator = require('./client-creator');

var cc = new ClientCreator(process.argv[2] || path.join(__dirname, '..'));

cc.writeClientServices();
console.log('Finished updating services.');
