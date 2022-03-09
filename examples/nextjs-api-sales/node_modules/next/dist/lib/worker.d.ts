import { Worker as JestWorker } from 'next/dist/compiled/jest-worker';
declare type FarmOptions = ConstructorParameters<typeof JestWorker>[1];
export declare class Worker {
    private _worker;
    constructor(workerPath: string, options: FarmOptions & {
        timeout?: number;
        onRestart?: (method: string, args: any[], attempts: number) => void;
        exposedMethods: ReadonlyArray<string>;
    });
    end(): ReturnType<JestWorker['end']>;
}
export {};
