import { context, features, HTTPError } from "@budibase/backend-core"
import {
  type AnyDocument,
  FeatureFlag,
  type WithDocMetadata,
} from "@budibase/types"
import {
  getResourceType,
  isDisallowedProjectAssignmentResourceId,
} from "../resources/utils"
import {
  isProjectAssignableResourceType,
  type ProjectAssignable,
  withProjectIds,
} from "./utils"
import { get as getProject } from "./crud"

interface UpdateResourceProjectAssignmentInput {
  resourceId: string
  resourceRev: string
  projectIds: string[]
}

export const getProjectAssignableResource = async (
  resourceId: string
): Promise<WithDocMetadata<AnyDocument & ProjectAssignable>> => {
  const resourceType = getResourceType(resourceId)
  if (
    !resourceType ||
    !isProjectAssignableResourceType(resourceType) ||
    isDisallowedProjectAssignmentResourceId(resourceId)
  ) {
    throw new HTTPError("Resource cannot be assigned to a project.", 400)
  }

  const resource = await context
    .getWorkspaceDB()
    .tryGet<WithDocMetadata<AnyDocument & ProjectAssignable>>(resourceId)
  if (!resource) {
    throw new HTTPError(`Resource '${resourceId}' not found.`, 404)
  }
  return resource
}

export const updateResourceProjectAssignment = async ({
  resourceId,
  resourceRev,
  projectIds,
}: UpdateResourceProjectAssignmentInput): Promise<
  WithDocMetadata<AnyDocument & ProjectAssignable>
> => {
  if (!(await features.isEnabled(FeatureFlag.PROJECTS))) {
    throw new HTTPError("Projects feature is not enabled.", 404)
  }

  const db = context.getWorkspaceDB()
  const uniqueProjectIds = Array.from(new Set(projectIds))
  const projects = await Promise.all(uniqueProjectIds.map(getProject))
  const missingProjectId = uniqueProjectIds.find(
    (_projectId, index) => !projects[index]
  )
  if (missingProjectId) {
    throw new HTTPError(`Project '${missingProjectId}' not found.`, 404)
  }

  const resource = await getProjectAssignableResource(resourceId)
  if (resource._rev !== resourceRev) {
    throw new HTTPError("Resource revision does not match.", 409)
  }

  const updated = withProjectIds(resource, uniqueProjectIds)
  const response = await db.put(updated)
  return {
    ...updated,
    _rev: response.rev,
  }
}
