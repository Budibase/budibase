"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigManager = void 0;
const fs = require("fs");
const path = require("path");
const os = require("os");
const { error } = require("../utils");
class ConfigManager {
    constructor() {
        this.path = path.join(os.homedir(), ".budibase.json");
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, "{}");
        }
    }
    get config() {
        try {
            return JSON.parse(fs.readFileSync(this.path, "utf8"));
        }
        catch (err) {
            console.log(error("Error parsing configuration file. Please check your .budibase.json is valid."));
            return {};
        }
    }
    set config(json) {
        fs.writeFileSync(this.path, JSON.stringify(json));
    }
    getValue(key) {
        return this.config[key];
    }
    setValue(key, value) {
        this.config = Object.assign(Object.assign({}, this.config), { [key]: value });
    }
    removeKey(key) {
        const updated = Object.assign({}, this.config);
        delete updated[key];
        this.config = updated;
    }
}
exports.ConfigManager = ConfigManager;
