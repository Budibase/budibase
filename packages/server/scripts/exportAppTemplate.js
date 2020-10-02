#!/usr/bin/env node
const { exportTemplateFromApp } = require("../src/utilities/templates")
const yargs = require("yargs")

// Script to export a chosen budibase app into a package
// Usage: ./scripts/exportAppTemplate.js export --name=Funky --instanceId=someInstanceId --appId=appId

yargs
  .command(
    "export",
    "Export an existing budibase application to the .budibase/templates directory",
    {
      name: {
        description: "The name of the newly exported template",
        alias: "n",
        type: "string",
      },
      instanceId: {
        description: "The instanceId to dump the database for",
        alias: "inst",
        type: "string",
      },
      appId: {
        description: "The appId of the application you want to export",
        alias: "app",
        type: "string",
      },
    },
    async args => {
      console.log("Exporting app..")
      const exportPath = await exportTemplateFromApp({
        templateName: args.name,
        instanceId: args.instanceId,
        appId: args.appId,
      })
      console.log(`Template ${args.name} exported to ${exportPath}`)
    }
  )
  .help()
  .alias("help", "h").argv
