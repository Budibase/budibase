import { BudiStore } from "../BudiStore"
import { API } from "@/api"
import {
  PermissionLevel,
  GetResourcePermsResponse,
  GetDependantResourcesResponse,
  ResourcePermissionInfo,
} from "@budibase/types"

interface Permission {
  level: PermissionLevel
  role: string
  resource: string
}

export class PermissionStore extends BudiStore<Permission[]> {
  constructor() {
    super([])
  }

  save = async (permission: Permission) => {
    const { level, role, resource } = permission
    return await API.updatePermissionForResource(resource, role, level)
  }

  remove = async (permission: Permission) => {
    const { level, role, resource } = permission
    return await API.removePermissionFromResource(resource, role, level)
  }

  forResource = async (
    resourceId: string
  ): Promise<Record<string, ResourcePermissionInfo>> => {
    return (await API.getPermissionForResource(resourceId)).permissions
  }

  forResourceDetailed = async (
    resourceId: string
  ): Promise<GetResourcePermsResponse> => {
    return await API.getPermissionForResource(resourceId)
  }

  getDependantsInfo = async (
    resourceId: string
  ): Promise<GetDependantResourcesResponse> => {
    return await API.getDependants(resourceId)
  }
}

export const permissions = new PermissionStore()
