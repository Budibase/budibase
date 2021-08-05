const fs = require("fs")
const path = require("path")

const MONOREPO_ROOT = "packages"

const packages = fs.readdirSync(MONOREPO_ROOT)

function pinDeps(dependencies) {
	for (let dependency in dependencies) {
		if (dependency.startsWith("@budibase")) {
			dependencies[dependency] = dependencies[dependency].replace("^", "")
		}
	}
}

// iterate over the monorepo packages
for (let pkg of packages) {
	const pkgPath = path.join(MONOREPO_ROOT, pkg)

	// only directories
	if (fs.statSync(pkgPath).isDirectory()) {


		// get the package JSON file
		const pkgJsonPath = path.join(pkgPath, "package.json")
		const pkgJson = require(`../${pkgJsonPath}`)

		// find any budibase dependencies, and pin them
		pinDeps(pkgJson.dependencies)
		pinDeps(pkgJson.devDependencies)

		// update the package JSON files
		fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2))
	}
}

console.log("Pinned dev versions for budibase packages successfully.")