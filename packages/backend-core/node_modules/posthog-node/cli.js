#!/usr/bin/env node
'use strict'

const program = require('commander')
const PostHog = require('.')
const pkg = require('./package')

const toObject = (str) => JSON.parse(str)

program
    .version(pkg.version)
    .option('-k, --apiKey <key>', 'the PostHog api key to use')
    .option('-h, --host <host>', 'the PostHog API hostname to use')
    .option('-t, --type <type>', 'the PostHog message type')

    .option('-d, --distinctId <id>', 'the distinct id to send the event as')

    .option('-e, --event <event>', 'the event name to send with the event')
    .option('-p, --properties <properties>', 'the event properties to send (JSON-encoded)', toObject)

    .option('-a, --alias <previousId>', 'alias for the distinct id')

    .parse(process.argv)

if (program.args.length !== 0) {
    program.help()
}

const apiKey = program.apiKey
const host = program.host
const type = program.type

const distinctId = program.distinctId

const event = program.event
const properties = program.properties
const alias = program.alias

const run = (method, args) => {
    const posthog = new PostHog(apiKey, { host, flushAt: 1 })
    posthog[method](args, (err) => {
        if (err) {
            console.error(err.stack)
            process.exit(1)
        }
    })
}

switch (type) {
    case 'capture':
        run('capture', {
            event,
            properties,
            distinctId,
        })
        break
    case 'identify':
        run('identify', {
            properties,
            distinctId,
        })
        break
    case 'alias':
        run('alias', {
            alias,
            distinctId,
        })
        break
    default:
        console.error('invalid type:', type)
        process.exit(1)
}
