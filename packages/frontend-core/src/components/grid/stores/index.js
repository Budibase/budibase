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

const DependencyOrderedStores = [
  Bounds,
  Scroll,
  Rows,
  Columns,
  UI,
  Validation,
  Resize,
  Viewport,
  Reorder,
  Users,
  Menu,
  Pagination,
  Clipboard,
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

  // Initialise any store logic
  for (let store of DependencyOrderedStores) {
    store.initialise?.(context)
  }

  return context
}
