export namespace BUILTIN_PERMISSION_IDS {
    const PUBLIC: string;
    const READ_ONLY: string;
    const WRITE: string;
    const ADMIN: string;
    const POWER: string;
}
export function getBuiltinPermissions(): {
    PUBLIC: {
        _id: string;
        name: string;
        permissions: Permission[];
    };
    READ_ONLY: {
        _id: string;
        name: string;
        permissions: Permission[];
    };
    WRITE: {
        _id: string;
        name: string;
        permissions: Permission[];
    };
    POWER: {
        _id: string;
        name: string;
        permissions: Permission[];
    };
    ADMIN: {
        _id: string;
        name: string;
        permissions: Permission[];
    };
};
export function getBuiltinPermissionByID(id: any): {
    _id: string;
    name: string;
    permissions: Permission[];
} | {
    _id: string;
    name: string;
    permissions: Permission[];
} | {
    _id: string;
    name: string;
    permissions: Permission[];
} | {
    _id: string;
    name: string;
    permissions: Permission[];
} | {
    _id: string;
    name: string;
    permissions: Permission[];
} | undefined;
export function doesHaveBasePermission(permType: any, permLevel: any, rolesHierarchy: any): boolean;
export function isPermissionLevelHigherThanRead(level: any): boolean;
declare function Permission(type: any, level: any): void;
declare class Permission {
    constructor(type: any, level: any);
    level: any;
    type: any;
}
export var BUILDER: string;
export namespace PermissionTypes {
    const APP: string;
    const TABLE: string;
    const USER: string;
    const AUTOMATION: string;
    const WEBHOOK: string;
    const VIEW: string;
    const QUERY: string;
}
export namespace PermissionLevels {
    export const READ: string;
    const WRITE_1: string;
    export { WRITE_1 as WRITE };
    export const EXECUTE: string;
    const ADMIN_1: string;
    export { ADMIN_1 as ADMIN };
}
export {};
