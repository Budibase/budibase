import { EventPublishType, PostEventPublishRequest } from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface EventEndpoints {
  publishEvent: (type: EventPublishType) => Promise<void>
}

export const buildEventEndpoints = (API: BaseAPIClient): EventEndpoints => ({
  publishEvent: async type => {
    return await API.post<PostEventPublishRequest>({
      url: `/api/global/event/publish`,
      body: {
        type,
      },
    })
  },
})
