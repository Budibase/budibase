import analytics from "./analytics"
import backups from "./backups"
import hosting from "./hosting"
import plugins from "./plugins"

export function getCommands() {
  return [hosting, analytics, backups, plugins]
}
