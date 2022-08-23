import AnalyticsProcessor from "./AnalyticsProcessor"
import LoggingProcessor from "./LoggingProcessor"
import Processors from "./Processors"

export const analyticsProcessor = new AnalyticsProcessor()
const loggingProcessor = new LoggingProcessor()

export const processors = new Processors([analyticsProcessor, loggingProcessor])
