"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tsconfig_loader_1 = require("../tsconfig-loader");
var path_1 = require("path");
describe("tsconfig-loader", function () {
    it("should find tsconfig in cwd", function () {
        var result = (0, tsconfig_loader_1.tsConfigLoader)({
            cwd: "/foo/bar",
            getEnv: function (_) { return undefined; },
            loadSync: function (cwd) {
                return {
                    tsConfigPath: "".concat(cwd, "/tsconfig.json"),
                    baseUrl: "./",
                    paths: {},
                };
            },
        });
        expect(result.tsConfigPath).toBe("/foo/bar/tsconfig.json");
    });
    it("should return loaderResult.tsConfigPath as undefined when not found", function () {
        var result = (0, tsconfig_loader_1.tsConfigLoader)({
            cwd: "/foo/bar",
            getEnv: function (_) { return undefined; },
            loadSync: function (_) {
                return {
                    tsConfigPath: undefined,
                    baseUrl: "./",
                    paths: {},
                };
            },
        });
        expect(result.tsConfigPath).toBeUndefined();
    });
    it("should use TS_NODE_PROJECT env if exists", function () {
        var result = (0, tsconfig_loader_1.tsConfigLoader)({
            cwd: "/foo/bar",
            getEnv: function (key) {
                return key === "TS_NODE_PROJECT" ? "/foo/baz" : undefined;
            },
            loadSync: function (cwd, fileName) {
                if (cwd === "/foo/bar" && fileName === "/foo/baz") {
                    return {
                        tsConfigPath: "/foo/baz/tsconfig.json",
                        baseUrl: "./",
                        paths: {},
                    };
                }
                return {
                    tsConfigPath: undefined,
                    baseUrl: "./",
                    paths: {},
                };
            },
        });
        expect(result.tsConfigPath).toBe("/foo/baz/tsconfig.json");
    });
    it("should use TS_NODE_BASEURL env if exists", function () {
        var result = (0, tsconfig_loader_1.tsConfigLoader)({
            cwd: "/foo/bar",
            getEnv: function (key) {
                return key === "TS_NODE_BASEURL" ? "SOME_BASEURL" : undefined;
            },
            loadSync: function (_0, _1, baseUrl) {
                return {
                    tsConfigPath: undefined,
                    baseUrl: baseUrl,
                    paths: {},
                };
            },
        });
        expect(result.baseUrl).toBe("SOME_BASEURL");
    });
    it("should not use TS_NODE_BASEURL env if it does not exist", function () {
        var result = (0, tsconfig_loader_1.tsConfigLoader)({
            cwd: "/foo/bar",
            getEnv: function (_) {
                return undefined;
            },
            loadSync: function (_0, _1, baseUrl) {
                return {
                    tsConfigPath: undefined,
                    baseUrl: baseUrl,
                    paths: {},
                };
            },
        });
        expect(result.baseUrl).toBeUndefined();
    });
});
describe("walkForTsConfig", function () {
    it("should find tsconfig in starting directory", function () {
        var pathToTsconfig = (0, path_1.join)("/root", "dir1", "tsconfig.json");
        var mockFiles = {
            "/root/dir1": ["tsconfig.json"],
        };
        var res = (0, tsconfig_loader_1.walkForTsConfig)((0, path_1.join)("/root", "dir1"), function (path) { return mockFiles[path] || []; });
        expect(res).toBe(pathToTsconfig);
    });
    it("should find jsconfig in starting directory", function () {
        var pathToJsconfig = (0, path_1.join)("/root", "dir1", "jsconfig.json");
        var mockFiles = {
            "/root/dir1": ["jsconfig.json"],
        };
        var res = (0, tsconfig_loader_1.walkForTsConfig)((0, path_1.join)("/root", "dir1"), function (path) { return mockFiles[path] || []; });
        expect(res).toBe(pathToJsconfig);
    });
    // see https://github.com/Microsoft/TypeScript/issues/15869#issuecomment-301845650
    it("tsconfig.json take precedence over jsconfig.json when both exist", function () {
        var pathToTsconfig = (0, path_1.join)("/root/dir1", "tsconfig.json");
        var mockFiles = {
            "/root/dir1": ["jsconfig.json", "tsconfig.json"],
        };
        var res = (0, tsconfig_loader_1.walkForTsConfig)((0, path_1.join)("/root", "dir1"), function (path) { return mockFiles[path] || []; });
        expect(res).toBe(pathToTsconfig);
    });
    it("should find tsconfig in parent directory", function () {
        var pathToTsconfig = (0, path_1.join)("/root", "tsconfig.json");
        var mockFiles = {
            "/root": ["tsconfig.json"],
        };
        var res = (0, tsconfig_loader_1.walkForTsConfig)((0, path_1.join)("/root", "dir1"), function (path) { return mockFiles[path] || []; });
        expect(res).toBe(pathToTsconfig);
    });
    it("should find jsconfig in parent directory", function () {
        var pathToTsconfig = (0, path_1.join)("/root", "jsconfig.json");
        var mockFiles = {
            "/root": ["jsconfig.json"],
        };
        var res = (0, tsconfig_loader_1.walkForTsConfig)((0, path_1.join)("/root", "dir1"), function (path) { return mockFiles[path] || []; });
        expect(res).toBe(pathToTsconfig);
    });
    it("should return undefined when reaching the top", function () {
        var res = (0, tsconfig_loader_1.walkForTsConfig)((0, path_1.join)("/root", "dir1", "kalle"), function () { return []; });
        expect(res).toBeUndefined();
    });
});
describe("loadConfig", function () {
    it("It should load a config", function () {
        var config = { compilerOptions: { baseUrl: "hej" } };
        var res = (0, tsconfig_loader_1.loadTsconfig)("/root/dir1/tsconfig.json", function (path) { return path === "/root/dir1/tsconfig.json"; }, function (_) { return JSON.stringify(config); });
        expect(res).toStrictEqual(config);
    });
    it("It should load a config with comments", function () {
        var config = { compilerOptions: { baseUrl: "hej" } };
        var res = (0, tsconfig_loader_1.loadTsconfig)("/root/dir1/tsconfig.json", function (path) { return path === "/root/dir1/tsconfig.json"; }, function (_) { return "{\n          // my comment\n          \"compilerOptions\": { \n            \"baseUrl\": \"hej\"\n          }\n        }"; });
        expect(res).toStrictEqual(config);
    });
    it("It should load a config with trailing commas", function () {
        var config = { compilerOptions: { baseUrl: "hej" } };
        var res = (0, tsconfig_loader_1.loadTsconfig)("/root/dir1/tsconfig.json", function (path) { return path === "/root/dir1/tsconfig.json"; }, function (_) { return "{\n          \"compilerOptions\": { \n            \"baseUrl\": \"hej\",\n          },\n        }"; });
        expect(res).toStrictEqual(config);
    });
    it("It should load a config with extends and overwrite all options", function () {
        var firstConfig = {
            extends: "../base-config.json",
            compilerOptions: { baseUrl: "kalle", paths: { foo: ["bar2"] } },
        };
        var firstConfigPath = (0, path_1.join)("/root", "dir1", "tsconfig.json");
        var baseConfig = {
            compilerOptions: {
                baseUrl: "olle",
                paths: { foo: ["bar1"] },
                strict: true,
            },
        };
        var baseConfigPath = (0, path_1.join)("/root", "base-config.json");
        var res = (0, tsconfig_loader_1.loadTsconfig)((0, path_1.join)("/root", "dir1", "tsconfig.json"), function (path) { return path === firstConfigPath || path === baseConfigPath; }, function (path) {
            if (path === firstConfigPath) {
                return JSON.stringify(firstConfig);
            }
            if (path === baseConfigPath) {
                return JSON.stringify(baseConfig);
            }
            return "";
        });
        expect(res).toEqual({
            extends: "../base-config.json",
            compilerOptions: {
                baseUrl: "kalle",
                paths: { foo: ["bar2"] },
                strict: true,
            },
        });
    });
    it("It should load a config with extends from node_modules and overwrite all options", function () {
        var firstConfig = {
            extends: "my-package/base-config.json",
            compilerOptions: { baseUrl: "kalle", paths: { foo: ["bar2"] } },
        };
        var firstConfigPath = (0, path_1.join)("/root", "dir1", "tsconfig.json");
        var baseConfig = {
            compilerOptions: {
                baseUrl: "olle",
                paths: { foo: ["bar1"] },
                strict: true,
            },
        };
        var baseConfigPath = (0, path_1.join)("/root", "dir1", "node_modules", "my-package", "base-config.json");
        var res = (0, tsconfig_loader_1.loadTsconfig)((0, path_1.join)("/root", "dir1", "tsconfig.json"), function (path) { return path === firstConfigPath || path === baseConfigPath; }, function (path) {
            if (path === firstConfigPath) {
                return JSON.stringify(firstConfig);
            }
            if (path === baseConfigPath) {
                return JSON.stringify(baseConfig);
            }
            return "";
        });
        expect(res).toEqual({
            extends: "my-package/base-config.json",
            compilerOptions: {
                baseUrl: "kalle",
                paths: { foo: ["bar2"] },
                strict: true,
            },
        });
    });
    it("Should use baseUrl relative to location of extended tsconfig", function () {
        var firstConfig = { compilerOptions: { baseUrl: "." } };
        var firstConfigPath = (0, path_1.join)("/root", "first-config.json");
        var secondConfig = { extends: "../first-config.json" };
        var secondConfigPath = (0, path_1.join)("/root", "dir1", "second-config.json");
        var thirdConfig = { extends: "../second-config.json" };
        var thirdConfigPath = (0, path_1.join)("/root", "dir1", "dir2", "third-config.json");
        var res = (0, tsconfig_loader_1.loadTsconfig)((0, path_1.join)("/root", "dir1", "dir2", "third-config.json"), function (path) {
            return path === firstConfigPath ||
                path === secondConfigPath ||
                path === thirdConfigPath;
        }, function (path) {
            if (path === firstConfigPath) {
                return JSON.stringify(firstConfig);
            }
            if (path === secondConfigPath) {
                return JSON.stringify(secondConfig);
            }
            if (path === thirdConfigPath) {
                return JSON.stringify(thirdConfig);
            }
            return "";
        });
        expect(res).toEqual({
            extends: "../second-config.json",
            compilerOptions: { baseUrl: (0, path_1.join)("..", "..") },
        });
    });
});
//# sourceMappingURL=tsconfig-loader.test.js.map