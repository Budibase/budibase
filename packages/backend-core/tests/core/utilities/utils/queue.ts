import { Queue } from "bull"
import { GenericContainer, Wait } from "testcontainers"

export async function useRealQueues() {
  const redis = await new GenericContainer("redis")
    .withExposedPorts(6379)
    .withWaitStrategy(
      Wait.forSuccessfulCommand(`redis-cli`).withStartupTimeout(10000)
    )
    .start()

  const port = redis.getMappedPort(6379)
  process.env.BULL_TEST_REDIS_PORT = port.toString()
}

export async function processMessages(queue: Queue) {
  do {
    await queue.whenCurrentJobsFinished()
  } while (await queue.count())

  await queue.whenCurrentJobsFinished()
}
