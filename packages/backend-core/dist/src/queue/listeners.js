"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addListeners = void 0;
const constants_1 = require("./constants");
function addListeners(queue, jobQueue, removeStalledCb) {
    logging(queue, jobQueue);
    if (removeStalledCb) {
        handleStalled(queue, removeStalledCb);
    }
}
exports.addListeners = addListeners;
function handleStalled(queue, removeStalledCb) {
    queue.on("stalled", (job) => __awaiter(this, void 0, void 0, function* () {
        if (removeStalledCb) {
            yield removeStalledCb(job);
        }
        else if (job.opts.repeat) {
            const jobId = job.id;
            const repeatJobs = yield queue.getRepeatableJobs();
            for (let repeatJob of repeatJobs) {
                if (repeatJob.id === jobId) {
                    yield queue.removeRepeatableByKey(repeatJob.key);
                }
            }
            console.log(`jobId=${jobId} disabled`);
        }
    }));
}
function logging(queue, jobQueue) {
    var _a;
    let eventType;
    switch (jobQueue) {
        case constants_1.JobQueue.AUTOMATION:
            eventType = "automation-event";
            break;
        case constants_1.JobQueue.APP_BACKUP:
            eventType = "app-backup-event";
            break;
    }
    if ((_a = process.env.NODE_DEBUG) === null || _a === void 0 ? void 0 : _a.includes("bull")) {
        queue
            .on("error", (error) => {
            // An error occurred.
            console.error(`${eventType}=error error=${JSON.stringify(error)}`);
        })
            .on("waiting", (jobId) => {
            // A Job is waiting to be processed as soon as a worker is idling.
            console.log(`${eventType}=waiting jobId=${jobId}`);
        })
            .on("active", (job, jobPromise) => {
            // A job has started. You can use `jobPromise.cancel()`` to abort it.
            console.log(`${eventType}=active jobId=${job.id}`);
        })
            .on("stalled", (job) => {
            // A job has been marked as stalled. This is useful for debugging job
            // workers that crash or pause the event loop.
            console.error(`${eventType}=stalled jobId=${job.id} job=${JSON.stringify(job)}`);
        })
            .on("progress", (job, progress) => {
            // A job's progress was updated!
            console.log(`${eventType}=progress jobId=${job.id} progress=${progress}`);
        })
            .on("completed", (job, result) => {
            // A job successfully completed with a `result`.
            console.log(`${eventType}=completed jobId=${job.id} result=${result}`);
        })
            .on("failed", (job, err) => {
            // A job failed with reason `err`!
            console.log(`${eventType}=failed jobId=${job.id} error=${err}`);
        })
            .on("paused", () => {
            // The queue has been paused.
            console.log(`${eventType}=paused`);
        })
            .on("resumed", (job) => {
            // The queue has been resumed.
            console.log(`${eventType}=paused jobId=${job.id}`);
        })
            .on("cleaned", (jobs, type) => {
            // Old jobs have been cleaned from the queue. `jobs` is an array of cleaned
            // jobs, and `type` is the type of jobs cleaned.
            console.log(`${eventType}=cleaned length=${jobs.length} type=${type}`);
        })
            .on("drained", () => {
            // Emitted every time the queue has processed all the waiting jobs (even if there can be some delayed jobs not yet processed)
            console.log(`${eventType}=drained`);
        })
            .on("removed", (job) => {
            // A job successfully removed.
            console.log(`${eventType}=removed jobId=${job.id}`);
        });
    }
}
//# sourceMappingURL=listeners.js.map