"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hasNecessaryDependencies = hasNecessaryDependencies;
async function hasNecessaryDependencies(baseDir, requiredPackages) {
    let resolutions = new Map();
    const missingPackages = requiredPackages.filter((p)=>{
        try {
            resolutions.set(p.pkg, require.resolve(p.file, {
                paths: [
                    baseDir
                ]
            }));
            return false;
        } catch (_) {
            return true;
        }
    });
    return {
        resolved: resolutions,
        missing: missingPackages
    };
}

//# sourceMappingURL=has-necessary-dependencies.js.map