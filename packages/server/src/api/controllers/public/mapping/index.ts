import tables from "./tables"
import applications from "./applications"
import users from "./users"
import rows from "./rows"
import queries from "./queries"

export default {
  ...tables,
  ...applications,
  ...users,
  ...rows,
  ...queries,
}
