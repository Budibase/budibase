import { Automation, AutomationStep } from "@budibase/types";
export declare function created(automation: Automation, timestamp?: string | number): Promise<void>;
export declare function triggerUpdated(automation: Automation): Promise<void>;
export declare function deleted(automation: Automation): Promise<void>;
export declare function tested(automation: Automation): Promise<void>;
export declare const run: (count: number, timestamp?: string | number) => Promise<void>;
export declare function stepCreated(automation: Automation, step: AutomationStep, timestamp?: string | number): Promise<void>;
export declare function stepDeleted(automation: Automation, step: AutomationStep): Promise<void>;
