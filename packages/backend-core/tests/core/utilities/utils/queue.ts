import { Queue } from "bull"
import { GenericContainer, Wait } from "testcontainers"

export async function useRealQueues() {
  const redis = await new GenericContainer("redis")
    .withExposedPorts(6379)
    .withEnvironment({})
    .withLabels({ "com.budibase": "true" })
    .withReuse()
    .withWaitStrategy(
      Wait.forSuccessfulCommand(
        `until redis-cli  ping | grep -q PONG; do
          echo "Waiting for Redis to be ready..."
          sleep 1
        done
        echo "Redis is ready!"`
      ).withStartupTimeout(10000)
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
