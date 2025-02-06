import { API } from "@/api"
import { BudiStore } from "@/stores/BudiStore"
import { FetchMediaResponse, Media } from "@budibase/types"

interface MediaState {}

export const INITIAL_MEDIA_STATE: Record<string, string> = {}

export class MediaStore extends BudiStore<MediaState> {
  constructor() {
    super(INITIAL_MEDIA_STATE)

    this.reset = this.reset.bind(this)
    this.syncMedia = this.syncMedia.bind(this)
  }

  reset() {
    this.store.set(INITIAL_MEDIA_STATE)
  }

  async syncMedia() {
    try {
      const resp: FetchMediaResponse = await API.fetchTenantMedia()
      this.store.set(
        resp.assets.reduce((acc: Record<string, string>, item: Media) => {
          acc[item.name] = item.url
          return acc
        }, {})
      )
    } catch (e) {
      console.error("Could not load media")
    }
  }
}

export const mediaStore = new MediaStore()
