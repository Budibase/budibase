import { JobQueue } from "./constants";
import BullQueue from "bull";
import { StalledFn } from "./listeners";
export declare function createQueue<T>(jobQueue: JobQueue, opts?: {
    removeStalledCb?: StalledFn;
}): BullQueue.Queue<T>;
