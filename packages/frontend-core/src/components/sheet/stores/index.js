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
]

export const createStores = context => {
  let stores = {}

  // Atomic store creation
  for (let store of DependencyOrderedStores) {
    stores = { ...stores, ...store.createStores?.({ ...context, ...stores }) }
  }

  // Derived store creation
  for (let store of DependencyOrderedStores) {
    stores = { ...stores, ...store.deriveStores?.({ ...context, ...stores }) }
  }

  return stores
}
