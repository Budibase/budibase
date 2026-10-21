import queries from "./queries"
import rows from "./rows"
import tables from "./tables"
import users from "./users"
import views from "./views"
import applications from "./workspaces"
import groups from "./groups"

export default {
  ...tables,
  ...applications,
  ...users,
  ...rows,
  ...queries,
  ...views,
  ...groups,
}
