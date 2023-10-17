var fs = require('fs');
var path = require('path');
var allowlist = require('./allowlist').allowlist;

function checkFile(location) {
    var file = fs.readFileSync(location);
    var code = file.toString();
    var lines = code.split('\n');
    var regionMatches = [];

    lines.forEach(function(line, idx) {
        var matches = line.match(/(us|eu|ap|sa|ca)-\w+-\d+/g);
        if (matches) {
            regionMatches.push({
                file: location,
                line: idx,
                code: line
            });
        }
    });

    return regionMatches;
}

function recursiveGetFilesIn(directory, extensions) {
    var filenames = [];

    var keys = fs.readdirSync(directory);

    for (var i = 0, iLen = keys.length; i < iLen; i++) {
        // check if it is a file
        var keyPath = path.join(directory, keys[i]);
        var stats = fs.statSync(keyPath);
        if (stats.isDirectory()) {
            filenames = filenames.concat(
                recursiveGetFilesIn(keyPath, extensions)
            );
            continue;
        }
        if (extensions.indexOf(path.extname(keyPath)) >= 0) {
            filenames.push(path.join(keyPath));
        }
    }

    return filenames;
}

function checkForRegions() {
    var libPath = path.join(__dirname, '..', '..', 'lib');
    var filePaths = recursiveGetFilesIn(libPath, ['.js']);
    var regionMatches = [];
    var warnings = [];

    filePaths.forEach(function(filePath) {
        regionMatches = regionMatches.concat(checkFile(filePath));
    });

    regionMatches.forEach(function(match) {
        var normalizedPath = match.file.substring(libPath.length);
        if (allowlist[normalizedPath] && allowlist[normalizedPath].indexOf(match.line) >= 0) {
            return;
        }
        warnings.push('File: ' + normalizedPath + '\tLine ' + match.line + ':\t' + match.code.trim());
    });

    if (warnings.length) {
        console.error('Hard-coded regions detected. This should only be done if absolutely certain!');
        warnings.forEach(function(warning) {
            console.error(warning);
        });
        process.exit(1);
    }
}

checkForRegions();