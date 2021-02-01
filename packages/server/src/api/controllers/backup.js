const { performDump } = require("../../utilities/templates")
const path = require("path")
const os = require("os")
const fs = require("fs-extra")

exports.exportAppDump = async function(ctx) {
  const { appId } = ctx.query

  const backupsDir = path.join(os.homedir(), ".budibase", "backups")
  fs.ensureDirSync(backupsDir)

  const backupIdentifier = `${appId} Backup: ${new Date()}.txt`

  await performDump({
    dir: backupsDir,
    appId,
    name: backupIdentifier,
  })

  ctx.status = 200

  const backupFile = path.join(backupsDir, backupIdentifier)

  ctx.attachment(backupIdentifier)
  ctx.body = fs.createReadStream(backupFile)
  // ctx.body = {
  //   url: `/api/backups/download/${backupIdentifier}`,
  // }
}

// exports.downloadAppDump = async function(ctx) {
//   const fileName = ctx.params.fileName

//   const backupsDir = path.join(os.homedir(), ".budibase", "backups")
//   fs.ensureDirSync(backupsDir)

//   const backupFile = path.join(backupsDir, fileName)

//   ctx.attachment(fileName)
//   ctx.body = fs.createReadStream(backupFile)
// }
