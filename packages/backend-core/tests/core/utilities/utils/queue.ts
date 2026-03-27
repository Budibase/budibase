import { Queue } from "../../../../src/queue"
import { GenericContainer, Wait } from "testcontainers"
import { startContainer } from "../testContainerUtils"

export async function useRealQueues() {
  await startContainer(
    new GenericContainer("redis")
      .withExposedPorts(6379)
      .withWaitStrategy(
        Wait.forSuccessfulCommand(`redis-cli`).withStartupTimeout(10000)
      )
  )
}

export async function processMessages(queue: Queue) {
  do {
    await queue.whenCurrentJobsFinished()
  } while (await queue.count())

  await queue.whenCurrentJobsFinished()
}
