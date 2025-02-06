import { Queue } from "bull"
import { GenericContainer, Wait } from "testcontainers"
import { startContainer } from "../testContainerUtils"

export async function useRealQueues() {
  const ports = await startContainer(
    new GenericContainer("redis")
      .withExposedPorts(6379)
      .withWaitStrategy(
        Wait.forSuccessfulCommand(`redis-cli`).withStartupTimeout(10000)
      )
  )

  const port = ports.find(x => x.container === 6379)?.host
  if (!port) {
    throw new Error("Redis port not found")
  }
  process.env.BULL_TEST_REDIS_PORT = port.toString()
}

export async function processMessages(queue: Queue) {
  do {
    await queue.whenCurrentJobsFinished()
  } while (await queue.count())

  await queue.whenCurrentJobsFinished()
}
