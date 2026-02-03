import backups from "./backup"
import * as processing from "./processing"
import { BackupInitOpts } from "../../types"
import { init as queueInit, getBackupQueue } from "./queue"

const init = async (opts: BackupInitOpts) => {
  queueInit()
  await processing.init(opts.processing)
}

export default {
  ...backups,
  processing,
  init,
  getBackupQueue,
}
