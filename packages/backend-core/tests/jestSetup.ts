import "./core/logging"
import env from "../src/environment"
import { cleanup } from "../src/timers"
import { mocks, testContainerUtils } from "./core/utilities"
import nock from "nock"
import { channel, unsubscribe } from "diagnostics_channel"
import type { Channel, ChannelListener } from "diagnostics_channel"

// mock all dates to 2020-01-01T00:00:00.000Z
// use tk.reset() to use real dates in individual tests
import tk from "timekeeper"

nock.disableNetConnect()
nock.enableNetConnect(host => {
  return (
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("::1")
  )
})

tk.freeze(mocks.date.MOCK_DATE)

if (!process.env.DEBUG) {
  console.log = jest.fn() // console.log are ignored in tests
}

if (!process.env.CI) {
  // set a longer timeout in dev for debugging
  // 100 seconds
  jest.setTimeout(100000)
}

testContainerUtils.setupEnv(env)

// dd-trace subscribes to this process-wide channel when it loads, and Jest
// reloads dd-trace for every test file. Remove the subscribers after each file
// so its environment can be garbage collected.
const DD_TRACE_IDENTITY_CHANNEL = "datadog:identity:update"

interface ChannelWithSubscribers extends Channel {
  _subscribers?: ChannelListener[]
}

const releaseDdTraceSubscribers = () => {
  const identityChannel: ChannelWithSubscribers = channel(
    DD_TRACE_IDENTITY_CHANNEL
  )
  for (const subscriber of [...(identityChannel._subscribers ?? [])]) {
    unsubscribe(DD_TRACE_IDENTITY_CHANNEL, subscriber)
  }
}

afterAll(() => {
  cleanup()
  // nock patches the shared http module when it loads; restore it so this
  // file's environment can be garbage collected
  nock.restore()
  releaseDdTraceSubscribers()
})
