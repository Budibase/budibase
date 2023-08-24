import * as Bounds from "./bounds"
import * as Columns from "./columns"
import * as Menu from "./menu"
import * as Pagination from "./pagination"
import * as Reorder from "./reorder"
import * as Resize from "./resize"
import * as Rows from "./rows"
import * as Scroll from "./scroll"
import * as UI from "./ui"
import * as Users from "./users"
import * as Validation from "./validation"
import * as Viewport from "./viewport"
import * as Clipboard from "./clipboard"
import * as Config from "./config"
import * as Sort from "./sort"
import * as Filter from "./filter"
import * as Notifications from "./notifications"
import * as Table from "./table"
import * as ViewV2 from "./viewV2"
import * as Datasource from "./datasource"

const DependencyOrderedStores = [
  Sort,
  Filter,
  Bounds,
  Scroll,
  Table,
  ViewV2,
  Datasource,
  Columns,
  Rows,
  UI,
  Validation,
  Resize,
  Viewport,
  Reorder,
  Users,
  Menu,
  Pagination,
  Clipboard,
  Config,
  Notifications,
]

export const attachStores = context => {
  // Atomic store creation
  for (let store of DependencyOrderedStores) {
    context = { ...context, ...store.createStores?.(context) }
  }

  // Derived store creation
  for (let store of DependencyOrderedStores) {
    context = { ...context, ...store.deriveStores?.(context) }
  }

  // Action creation
  for (let store of DependencyOrderedStores) {
    context = { ...context, ...store.createActions?.(context) }
  }

  // Initialise any store logic
  for (let store of DependencyOrderedStores) {
    store.initialise?.(context)
  }

  return context
}
