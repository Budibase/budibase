import { UserGroup, UserGroupRoles } from "@budibase/types";
export declare function created(group: UserGroup, timestamp?: number): Promise<void>;
export declare function updated(group: UserGroup): Promise<void>;
export declare function deleted(group: UserGroup): Promise<void>;
export declare function usersAdded(count: number, group: UserGroup): Promise<void>;
export declare function usersDeleted(emails: string[], group: UserGroup): Promise<void>;
export declare function createdOnboarding(groupId: string): Promise<void>;
export declare function permissionsEdited(roles: UserGroupRoles): Promise<void>;
