export as namespace timekeeper;

interface Timekeeper {
  freeze(date: Date | number | string): void;
  travel(date: Date | number | string): void;
  reset(): void;
  isKeepingTime(): boolean;
  withFreeze<T>(date: Date | number | string, callback: ()=>T): T;
}

declare const timekeeper: Timekeeper;

export = timekeeper;
