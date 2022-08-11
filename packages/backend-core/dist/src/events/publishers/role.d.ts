import { Role, User } from "@budibase/types";
export declare function created(role: Role, timestamp?: string | number): Promise<void>;
export declare function updated(role: Role): Promise<void>;
export declare function deleted(role: Role): Promise<void>;
export declare function assigned(user: User, roleId: string, timestamp?: number): Promise<void>;
export declare function unassigned(user: User, roleId: string): Promise<void>;
