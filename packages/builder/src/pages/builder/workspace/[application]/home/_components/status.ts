import {
  PublishResourceState,
  type Agent,
  type PublishStatusResource,
} from "@budibase/types"

const LIVE_LABEL = "Live"
const STOPPED_LABEL = "Stopped"
const NOT_DEPLOYED_LABEL = "Not Deployed"

const hasAgentDeploymentHistory = (agent: Agent) => !!agent.publishedAt

export const getPublishResourceStatusLabel = (
  publishStatus: Pick<PublishStatusResource, "state" | "lastDeployedLiveAt">
) => {
  if (publishStatus.state === PublishResourceState.PUBLISHED) {
    return LIVE_LABEL
  }

  return publishStatus.lastDeployedLiveAt ? STOPPED_LABEL : NOT_DEPLOYED_LABEL
}

export const getAgentStatusLabel = (agent: Agent) => {
  if (agent.live) {
    return LIVE_LABEL
  }

  return hasAgentDeploymentHistory(agent) ? STOPPED_LABEL : NOT_DEPLOYED_LABEL
}
