export default class Timer {
    constructor(callback: () => void, delay: number);
    private timerId;
    private start;
    private remaining;
    private callback;
    pause(): void;
    resume(): void;
    clear(): void;
}
