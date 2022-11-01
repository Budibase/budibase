import { Job, Queue } from "bull";
import { JobQueue } from "./constants";
export declare type StalledFn = (job: Job) => Promise<void>;
export declare function addListeners(queue: Queue, jobQueue: JobQueue, removeStalledCb?: StalledFn): void;
