"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../structures/Command");
const constants_1 = require("../constants");
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const db_1 = require("../core/db");
const utils_1 = require("../utils");
const utils_2 = require("./utils");
const objectStore_1 = require("./objectStore");
const tar = require("tar");
function exportBackup(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const envFile = opts.env || undefined;
        let filename = opts["export"] || opts;
        if (typeof filename !== "string") {
            filename = `backup-${new Date().toISOString()}.tar.gz`;
        }
        const config = yield (0, utils_2.getConfig)(envFile);
        const dbList = (yield (0, db_1.getAllDbs)(config["COUCH_DB_URL"]));
        const { Remote, Local } = (0, utils_2.getPouches)(config);
        if (fs_1.default.existsSync(utils_2.TEMP_DIR)) {
            fs_1.default.rmSync(utils_2.TEMP_DIR, { recursive: true });
        }
        const couchDir = (0, path_1.join)(utils_2.TEMP_DIR, utils_2.COUCH_DIR);
        fs_1.default.mkdirSync(utils_2.TEMP_DIR);
        fs_1.default.mkdirSync(couchDir);
        console.log("CouchDB Export");
        const bar = (0, utils_1.progressBar)(dbList.length);
        let count = 0;
        for (let db of dbList) {
            bar.update(++count);
            const remote = new Remote(db);
            const local = new Local((0, path_1.join)(utils_2.TEMP_DIR, utils_2.COUCH_DIR, db));
            yield (0, utils_2.replication)(remote, local);
        }
        bar.stop();
        console.log("S3 Export");
        yield (0, objectStore_1.exportObjects)();
        tar.create({
            sync: true,
            gzip: true,
            file: filename,
            cwd: (0, path_1.join)(utils_2.TEMP_DIR),
        }, [utils_2.COUCH_DIR, utils_2.MINIO_DIR]);
        fs_1.default.rmSync(utils_2.TEMP_DIR, { recursive: true });
        console.log(`Generated export file - ${filename}`);
    });
}
function importBackup(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const envFile = opts.env || undefined;
        const filename = opts["import"] || opts;
        const config = yield (0, utils_2.getConfig)(envFile);
        if (!filename || !fs_1.default.existsSync(filename)) {
            console.error("Cannot import without specifying a valid file to import");
            process.exit(-1);
        }
        if (fs_1.default.existsSync(utils_2.TEMP_DIR)) {
            fs_1.default.rmSync(utils_2.TEMP_DIR, { recursive: true });
        }
        fs_1.default.mkdirSync(utils_2.TEMP_DIR);
        tar.extract({
            sync: true,
            cwd: (0, path_1.join)(utils_2.TEMP_DIR),
            file: filename,
        });
        const { Remote, Local } = (0, utils_2.getPouches)(config);
        const dbList = fs_1.default.readdirSync((0, path_1.join)(utils_2.TEMP_DIR, utils_2.COUCH_DIR));
        console.log("CouchDB Import");
        const bar = (0, utils_1.progressBar)(dbList.length);
        let count = 0;
        for (let db of dbList) {
            bar.update(++count);
            const remote = new Remote(db);
            const local = new Local((0, path_1.join)(utils_2.TEMP_DIR, utils_2.COUCH_DIR, db));
            yield (0, utils_2.replication)(local, remote);
        }
        bar.stop();
        console.log("MinIO Import");
        yield (0, objectStore_1.importObjects)();
        // finish by letting the system know that a restore has occurred
        try {
            yield (0, utils_1.httpCall)(`http://localhost:${config.MAIN_PORT}/api/system/restored`, "POST");
        }
        catch (err) {
            // ignore error - it will be an older system
        }
        console.log("Import complete");
        fs_1.default.rmSync(utils_2.TEMP_DIR, { recursive: true });
    });
}
function pickOne(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        if (opts["import"]) {
            return importBackup(opts);
        }
        else if (opts["export"]) {
            return exportBackup(opts);
        }
    });
}
exports.default = new Command_1.Command(`${constants_1.CommandWord.BACKUPS}`)
    .addHelp("Allows building backups of Budibase, as well as importing a backup to a new instance.")
    .addSubOption("--export [filename]", "Export a backup from an existing Budibase installation.", exportBackup)
    .addSubOption("--import [filename]", "Import a backup to a new Budibase installation.", importBackup)
    .addSubOption("--env [envFile]", "Provide an environment variable file to configure the CLI.", pickOne);
