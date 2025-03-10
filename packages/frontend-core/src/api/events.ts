import type {
  EventPublishType,
  PostEventPublishRequest,
  PostEventPublishResponse,
} from "@budibase/types"
import type { BaseAPIClient } from "./types"

export interface EventEndpoints {
  publishEvent: (type: EventPublishType) => Promise<PostEventPublishResponse>
}

export const buildEventEndpoints = (API: BaseAPIClient): EventEndpoints => ({
  publishEvent: async type => {
    return await API.post<PostEventPublishRequest, PostEventPublishResponse>({
      url: `/api/global/event/publish`,
      body: {
        type,
      },
    })
  },
})
