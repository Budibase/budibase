import {setupApphierarchy, validUser,
    basicAppHierarchyCreator_WithFields} from "./specHelpers";
import { parseTemporaryCode,
    USERS_LOCK_FILE,
    USERS_LIST_FILE,
    getUserByName} from "../src/authApi/authCommon";
import {$} from "../src/common";
import {getLock} from "../src/common/lock";
import {permission} from "../src/authApi/permissions";

describe("authApi > enableUser", () => {

    it("should set access levels when valid levels supplied", async () => {
        const {authApi, app} = await setupApphierarchy(basicAppHierarchyCreator_WithFields);
        const u = await validUser(app, authApi, "firstpassword", true);
        await authApi.setUserAccessLevels(u.name, ["admin2"]);
        const loadedUser = await getUser(app, authApi, u.name);
        expect(loadedUser.accessLevels).toEqual(["admin2"]);

    });

    it("should throw error when access level invalid", async () => {
        const {authApi, app} = await setupApphierarchy(basicAppHierarchyCreator_WithFields);
        const u = await validUser(app, authApi, "firstpassword", true);
        expect(authApi.setUserAccessLevels(u.name, ["not valid"])).rejects.toThrow();
        const loadedUser = await getUser(app, authApi, u.name);
        expect(loadedUser.accessLevels).toEqual(["admin"]);
    });

    it("should throw en error when user does not exist", async () => {
        const {authApi, app} = await setupApphierarchy(basicAppHierarchyCreator_WithFields);
        const u = await validUser(app, authApi, "firstpassword", true);
        expect(authApi.setUserAccessLevels("nouser", ["admin"])).rejects.toThrow();
    });

    it("should throw en error when users file is locked", async () => {
        const {authApi, app} = await setupApphierarchy(basicAppHierarchyCreator_WithFields);
        const u = await validUser(app, authApi, "firstpassword", false);
        await getLock(app, USERS_LOCK_FILE, 10000, 0, 0);
        let ex;
        try {
            await authApi.setUserAccessLevels(u.name, ["admin"]);
        } catch(e) {
            ex = e;
        }
        expect(ex).toBeDefined();
    });

    it("should throw error when user user does not have permission", async () => {
        const {authApi, app} = await setupApphierarchy(basicAppHierarchyCreator_WithFields);
        const u = await validUser(app, authApi, "firstpassword", false);
        app.removePermission(permission.setUserAccessLevels.get());
        expect(authApi.setUserAccessLevels(u.name, ["admin"])).rejects.toThrow(/Unauthorized/);
    });

    it("should not depend on having any other permissions", async () => {
        const {authApi, app} = await setupApphierarchy(basicAppHierarchyCreator_WithFields);
        const u = await validUser(app, authApi, "firstpassword", false);
        app.withOnlyThisPermission(permission.setUserAccessLevels.get());
        await authApi.setUserAccessLevels(u.name, ["admin"]);
    });

});

const getUser = async (app, authApi, userName) => 
    $(await app.datastore.loadJson(USERS_LIST_FILE), [
        users => getUserByName(users, userName)
    ]);