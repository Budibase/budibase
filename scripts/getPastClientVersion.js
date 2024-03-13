const fs = require('node:fs/promises');
const path = require("path")
const util = require('node:util');
const { argv } = require('node:process');
const exec = util.promisify(require('node:child_process').exec);

const version = argv[2]

const getPastClientVersion = async () => {
  const manifestRaw = await fetch(`https://api.github.com/repos/budibase/budibase/contents/packages/client/manifest.json?ref=v${version}`).then(r => r.json());

  if (manifestRaw?.message?.includes("No commit found")) {
    throw `Can't find a GitHub tag with version "${version}"`
  }

  const manifest = Buffer.from(manifestRaw.content, 'base64').toString('utf8')

  await fs.mkdir(`packages/server/build/oldClientVersions/${version}`, { recursive: true });
  await fs.writeFile(`packages/server/build/oldClientVersions/${version}/manifest.json`, manifest)

  const npmRegistry = await fetch(`https://registry.npmjs.org/@budibase/client/${version}`).then(r => r.json());

  // the json response is just a string startin with the following if the version can't be found
  if (typeof npmRegistry === "string" &&  npmRegistry.startsWith("version not found")) {
    throw `Can't find @budibase/client with version "${version}" in npm registry`
  }

  await fs.mkdir("clientVersionTmp", { recursive: true });
  await exec(`curl -L ${npmRegistry.dist.tarball} --output - | tar -xvzf - -C clientVersionTmp`);
  await fs.copyFile('./clientVersionTmp/package/dist/budibase-client.js', `./packages/server/build/oldClientVersions/${version}/app.js`);
  await fs.rm("clientVersionTmp", { recursive: true });

  const rootDir = await fs.readdir('packages/server/build/oldClientVersions/', { withFileTypes: true });
  const dirs = rootDir.filter(entry => entry.isDirectory()).map(dir => dir.name);

  await fs.writeFile("packages/builder/src/components/deploy/clientVersions.json", JSON.stringify(dirs))

}

getPastClientVersion().catch(e => console.error(e));
