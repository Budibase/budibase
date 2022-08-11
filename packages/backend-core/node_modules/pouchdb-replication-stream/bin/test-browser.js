#!/usr/bin/env node
'use strict';

var wd = require('wd');
var sauceConnectLauncher = require('sauce-connect-launcher');
var selenium = require('selenium-standalone');
var querystring = require("querystring");

var devserver = require('./dev-server.js');

var testTimeout = 30 * 60 * 1000;

var username = process.env.SAUCE_USERNAME;
var accessKey = process.env.SAUCE_ACCESS_KEY;

// process.env.CLIENT is a colon seperated list of
// (saucelabs|selenium):browserName:browserVerion:platform
var tmp = (process.env.CLIENT || 'selenium:firefox').split(':');
var client = {
  runner: tmp[0] || 'selenium',
  browser: tmp[1] || 'firefox',
  version: tmp[2] || null, // Latest
  platform: tmp[3] || null
};

var testUrl = 'http://127.0.0.1:8001/test/index.html';
var qs = {};

var sauceClient;
var sauceConnectProcess;
var tunnelId = process.env.TRAVIS_JOB_NUMBER || 'tunnel-' + Date.now();

if (client.runner === 'saucelabs') {
  qs.saucelabs = true;
}
if (process.env.GREP) {
  qs.grep = process.env.GREP;
}
testUrl += '?';
testUrl += querystring.stringify(qs);

if (process.env.TRAVIS &&
    client.browser !== 'firefox' &&
    client.browser !== 'phantomjs' &&
    process.env.TRAVIS_SECURE_ENV_VARS === 'false') {
  console.error('Not running test, cannot connect to saucelabs');
  process.exit(1);
  return;
}

function testError(e) {
  console.error(e);
  console.error('Doh, tests failed');
  sauceClient.quit();
  process.exit(3);
}

function postResult(result) {
  process.exit(!process.env.PERF && result.failed ? 1 : 0);
}

function testComplete(result) {
  console.log(result);

  sauceClient.quit().then(function () {
    if (sauceConnectProcess) {
      sauceConnectProcess.close(function () {
        postResult(result);
      });
    } else {
      postResult(result);
    }
  });
}

function startSelenium(callback) {
  // Start selenium
  var opts = {version: '2.45.0'};
  selenium.install(opts, function(err) {
    if (err) {
      console.error('Failed to install selenium');
      process.exit(1);
    }
    selenium.start(opts, function(err, server) {
      sauceClient = wd.promiseChainRemote();
      callback();
    });
  });
}

function startSauceConnect(callback) {

  var options = {
    username: username,
    accessKey: accessKey,
    tunnelIdentifier: tunnelId
  };

  sauceConnectLauncher(options, function (err, process) {
    if (err) {
      console.error('Failed to connect to saucelabs');
      console.error(err);
      return process.exit(1);
    }
    sauceConnectProcess = process;
    sauceClient = wd.promiseChainRemote("localhost", 4445, username, accessKey);
    callback();
  });
}

function startTest() {

  console.log('Starting', client);

  var opts = {
    browserName: client.browser,
    version: client.version,
    platform: client.platform,
    tunnelTimeout: testTimeout,
    name: client.browser + ' - ' + tunnelId,
    'max-duration': 60 * 30,
    'command-timeout': 599,
    'idle-timeout': 599,
    'tunnel-identifier': tunnelId
  };

  sauceClient.init(opts).get(testUrl, function () {

    /* jshint evil: true */
    var interval = setInterval(function () {
      sauceClient.eval('window.results', function (err, results) {
        if (err) {
          clearInterval(interval);
          testError(err);
        } else if (results.completed || results.failures.length) {
          clearInterval(interval);
          testComplete(results);
        } else {
          console.log('=> ', results);
        }
      });
    }, 10 * 1000);
  });
}

devserver.start(function () {
  if (client.runner === 'saucelabs') {
    startSauceConnect(startTest);
  } else {
    startSelenium(startTest);
  }
});
