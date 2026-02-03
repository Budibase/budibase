import backups from "./backups"
import { InitOpts } from "../types"

export const init = async (opts: InitOpts) => {
  if (opts.backups) {
    await backups.init(opts.backups)
  }
}
