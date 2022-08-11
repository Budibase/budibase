export function getBuiltinRoles(): {
    ADMIN: Role;
    POWER: Role;
    BASIC: Role;
    PUBLIC: Role;
    BUILDER: Role;
};
export const BUILTIN_ROLE_ID_ARRAY: any[];
export const BUILTIN_ROLE_NAME_ARRAY: any[];
export function builtinRoleToNumber(id: any): number;
export function lowerBuiltinRoleID(roleId1: any, roleId2: any): any;
export function getRole(roleId: string | null): Promise<Role | object | null>;
export function getUserRoleHierarchy(userRoleId: string, opts?: object): Promise<string[]>;
export function checkForRoleResourceArray(rolePerms: any, resourceId: any): any;
export function getAllRoles(appId: any): Promise<object[]>;
export function getRequiredResourceRole(permLevel: any, { resourceId, subResourceId }: {
    resourceId: any;
    subResourceId: any;
}): Promise<{
    permissions;
} | Object>;
export function getDBRoleID(roleId: any): any;
export function getExternalRoleID(roleId: any): any;
export function Role(id: any, name: any): void;
export class Role {
    constructor(id: any, name: any);
    _id: any;
    name: any;
    addPermission(permissionId: any): Role;
    permissionId: any;
    addInheritance(inherits: any): Role;
    inherits: any;
}
export class AccessController {
    userHierarchies: {};
    hasAccess(tryingRoleId: any, userRoleId: any): Promise<boolean>;
    checkScreensAccess(screens: any, userRoleId: any): Promise<any[]>;
    checkScreenAccess(screen: any, userRoleId: any): Promise<any>;
}
declare namespace BUILTIN_IDS {
    const ADMIN: string;
    const POWER: string;
    const BASIC: string;
    const PUBLIC: string;
}
export function isBuiltin(role: any): boolean;
export { BUILTIN_IDS as BUILTIN_ROLE_IDS };
