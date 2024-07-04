import applications from "./applications"
import queries from "./queries"
import rows from "./rows"
import tables from "./tables"
import users from "./users"

export default {
  ...tables,
  ...applications,
  ...users,
  ...rows,
  ...queries,
}
