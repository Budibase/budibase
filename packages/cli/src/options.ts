import analytics from "./analytics"
import hosting from "./hosting"
import backups from "./backups"
import plugins from "./plugins"

export function getCommands() {
  return [hosting, analytics, backups, plugins]
}
