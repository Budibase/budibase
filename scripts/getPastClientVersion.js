const fs = require('node:fs/promises');
const path = require("path")
const { argv } = require('node:process');

const version = argv[2]

const hardcodedVersions = ["1.3.2"]

const getPastClientVersion = async () => {
  const tagByName = await fetch(`https://api.github.com/repos/budibase/budibase/git/ref/tags/v${version}`).then(r => r.json());
  const tagSha = tagByName.object.sha;

  const tagBySha = await fetch(`https://api.github.com/repos/budibase/budibase/git/tags/${tagSha}`).then(r => r.json());

  const commitSha = tagBySha.object.sha;

  // TODO the version tag in the client script request, does it do anything?
  // TODO can just use the tag in ref here directly
  const manifestRaw = await fetch(`https://api.github.com/repos/budibase/budibase/contents/packages/client/manifest.json?ref=${commitSha}`).then(r => r.json());

  const manifest = Buffer.from(manifestRaw.content, 'base64').toString('utf8')

  await fs.mkdir(`packages/server/build/oldClientVersions/${version}`, { recursive: true });

  await fs.writeFile(`packages/server/build/oldClientVersions/${version}/manifest.json`, manifest)

}

getPastClientVersion();
