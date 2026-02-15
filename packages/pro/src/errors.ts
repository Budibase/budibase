import { HTTPError } from "@budibase/backend-core"

export class GroupNameUnavailableError extends HTTPError {
  constructor(groupName: string) {
    super(`Group name "${groupName}" is unavailable`, 409)
  }
}
