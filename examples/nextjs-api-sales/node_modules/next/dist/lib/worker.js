"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jestWorker = require("next/dist/compiled/jest-worker");
const RESTARTED = Symbol('restarted');
class Worker {
    constructor(workerPath, options){
        let { timeout , onRestart , ...farmOptions } = options;
        let restartPromise;
        let resolveRestartPromise;
        let activeTasks = 0;
        this._worker = undefined;
        const createWorker = ()=>{
            this._worker = new _jestWorker.Worker(workerPath, farmOptions);
            restartPromise = new Promise((resolve)=>resolveRestartPromise = resolve
            );
            this._worker.getStdout().pipe(process.stdout);
            this._worker.getStderr().pipe(process.stderr);
        };
        createWorker();
        const onHanging = ()=>{
            const worker = this._worker;
            if (!worker) return;
            const resolve = resolveRestartPromise;
            createWorker();
            worker.end().then(()=>{
                resolve(RESTARTED);
            });
        };
        let hangingTimer = false;
        const onActivity = ()=>{
            if (hangingTimer) clearTimeout(hangingTimer);
            hangingTimer = activeTasks > 0 && setTimeout(onHanging, timeout);
        };
        for (const method of farmOptions.exposedMethods){
            if (method.startsWith('_')) continue;
            this[method] = timeout ? async (...args)=>{
                activeTasks++;
                try {
                    let attempts = 0;
                    for(;;){
                        onActivity();
                        const result = await Promise.race([
                            this._worker[method](...args),
                            restartPromise, 
                        ]);
                        if (result !== RESTARTED) return result;
                        if (onRestart) onRestart(method, args, ++attempts);
                    }
                } finally{
                    activeTasks--;
                    onActivity();
                }
            } : this._worker[method].bind(this._worker);
        }
    }
    end() {
        const worker = this._worker;
        if (!worker) {
            throw new Error('Farm is ended, no more calls can be done to it');
        }
        this._worker = undefined;
        return worker.end();
    }
}
exports.Worker = Worker;

//# sourceMappingURL=worker.js.map