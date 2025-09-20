import { Role, RoleUIMetadata } from "../documents"
import { WithRequired } from "../shared"

export interface UIRole extends WithRequired<Role, "_id" | "_rev"> {
  uiMetadata: Required<RoleUIMetadata>
}
