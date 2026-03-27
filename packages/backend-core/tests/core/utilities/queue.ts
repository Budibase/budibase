import { Queue } from "../../../src/queue"

export async function processMessages(queue: Queue) {
  do {
    await queue.whenCurrentJobsFinished()
  } while (await queue.count())

  await queue.whenCurrentJobsFinished()
}
