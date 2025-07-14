import { EndpointGroup } from "../../utils"

class CustomEndpointGroups {
  private groups: EndpointGroup[] = []

  group() {
    const group = new EndpointGroup()
    this.groups.push(group)
    return group
  }

  list() {
    return this.groups
  }
}

export const customEndpointGroups = new CustomEndpointGroups()
