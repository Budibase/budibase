#!/usr/bin/env node
const { exportTemplateFromApp } = require("../src/utilities/templates")

// Script to export a chosen budibase app into a package

const [name, instanceId, appId] = process.argv.slice(1)

exportTemplateFromApp({
  templateName: "Funky",
  instanceId: "inst_b70abba_16feb394866140a1ac3f2e450e99f28a",
  appId: "b70abba3874546bf99a339911b579937",
})
