#!/usr/bin/env node

/*
 * Pass optional path to target directory as command line argument.
 *
 * The directory must include the apis/ folder and service customizations at
 * `lib/services`. Clients will be generated in `clients/`.
 *
 * If parameter is not passed the repository root will be used.
 */

var path = require('path');
var TSGenerator = require('./lib/ts-generator');

var basePath = process.argv[2] || path.join(__dirname, '..');

var tsGenerator = new TSGenerator({
    SdkRootDirectory: basePath
});

tsGenerator.generateAllClientTypings();
tsGenerator.generateGroupedClients();
tsGenerator.updateDynamoDBDocumentClient();
tsGenerator.generateConfigurationServicePlaceholders();
console.log('TypeScript Definitions created.');
