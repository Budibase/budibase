import { asyncEventQueue, init as initQueue } from "../events/asyncEvents"
import {
  ProcessorMap,
  default as DocumentUpdateProcessor,
} from "../events/processors/async/DocumentUpdateProcessor"

let processingPromise: Promise<void>
let documentProcessor: DocumentUpdateProcessor

export function init(processors: ProcessorMap) {
  if (!asyncEventQueue) {
    initQueue()
  }
  if (!documentProcessor) {
    documentProcessor = new DocumentUpdateProcessor(processors)
  }
  // if not processing in this instance, kick it off
  if (!processingPromise) {
    processingPromise = asyncEventQueue.process(async job => {
      const { event, identity, properties } = job.data
      await documentProcessor.processEvent(event, identity, properties)
    })
  }
}
