const { performDump } = require("../../utilities/templates")
const path = require("path")
const os = require("os")
const fs = require("fs-extra")

exports.exportAppDump = async function(ctx) {
  const { appId, appname } = ctx.query

  const backupsDir = path.join(os.homedir(), ".budibase", "backups")
  fs.ensureDirSync(backupsDir)

  const backupIdentifier = `${appname}Backup${new Date().getTime()}.txt`

  await performDump({
    dir: backupsDir,
    appId,
    name: backupIdentifier,
  })

  ctx.status = 200

  const backupFile = path.join(backupsDir, backupIdentifier)

  ctx.attachment(backupIdentifier)
  ctx.body = fs.createReadStream(backupFile)
}
