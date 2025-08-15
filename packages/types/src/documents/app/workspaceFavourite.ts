import { WorkspaceResource } from "../../api"
import { Document } from "../document"

export interface WorkspaceFavourite extends Document {
  resourceType: WorkspaceResource
  resourceId: string
  createdBy: string
}
