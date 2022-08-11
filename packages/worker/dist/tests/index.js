"use strict";
const TestConfiguration = require("./TestConfiguration");
const structures = require("./structures");
const mocks = require("./mocks");
const config = new TestConfiguration();
const request = config.getRequest();
module.exports = {
    structures,
    mocks,
    config,
    request,
};
