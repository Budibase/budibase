// Based on https://github.com/lafin/node-targz
// MIT license

const fs = require("fs");
const tar = require('tar-fs');
const zlib = require("zlib");
const { join, dirname, sep } = require("path");
const { exists, mkdir, unlink, stat } = require("../utilities/fsawait");
const { getRuntimePackageDirectory, getRuntimeAppsDirectory } = require("./runtimePackages");

module.exports.createTarGzPackage = async (config, appName) => {

    const appPath = join(config.latestAppsPath, appName);
    const distPath = join(appPath, "dist");

    if(!await exists(distPath)) {
        await mkdir(distPath);
    }

    const packagePath = `${distPath}/package.tar.gz`;
    if(await exists(`${packagePath}`)) {
        await unlink(packagePath);
    }

    await compress(appPath, packagePath);
    const size = (await stat(packagePath)).size;
    return {size, path:packagePath};
}

module.exports.unzipTarGzPackageToRuntime = async (src, appName, versionId) => {
    const versionDir = getRuntimePackageDirectory(appName, versionId);
    const appDir = getRuntimeAppsDirectory(appName);

    if(await exists(appDir)) {
        if(await exists(versionDir)) {
            await rimraf(versionDir);
        }
    } else {
        await mkdir(appDir);
    }

    await mkdir(versionDir);

    await decompress(src, versionDir);
}

const compress = (src, dest) => new Promise((resolve, reject) => {

    // ensure opts
    opts = {src, dest};
    opts.tar = {ignore: name => dirname(name).split(sep).pop() === "dist"};
    opts.gz = opts.gz || {};

    // default gzip config
    opts.gz.level = opts.gz.level || 6;
    opts.gz.memLevel = opts.gz.memLevel || 6;

    // ensure src and dest
    if(!opts.src) return reject("No source for compress!");
    if(!opts.dest) return reject("No destination for compress!");

    // go
    process.nextTick(function () {
        tar.pack(opts.src, opts.tar)
            .on('error', reject)
            .pipe(zlib.createGzip(opts.gz)
                .on('error', reject))
            .pipe(fs.createWriteStream(opts.dest)
                .on('error', reject)
                .on('finish', resolve));
    });
});

const decompress = (src, dest) => new Promise((resolve, reject) => {

    // ensure opts
    opts = {src, dest};
    opts.tar = opts.tar || {};
    opts.gz = opts.gz || {};

    // ensure src and dest
    if(!opts.src) return reject("No source for decompress!");
    if(!opts.dest) return reject("No destination for decompress!");

    // go
    process.nextTick(function () {
        fs.createReadStream(opts.src)
            .on('error', reject)
            .pipe(zlib.createGunzip(opts.gz)
                .on('error', reject))
            .pipe(tar.extract(opts.dest, opts.tar)
                .on('error', reject)
                .on('finish', resolve));
    });
});

