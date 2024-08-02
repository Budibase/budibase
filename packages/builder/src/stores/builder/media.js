import BudiStore from "../BudiStore"
import { API } from "api"

export const INITIAL_MEDIA_STATE = {}

export class MediaStore extends BudiStore {
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
      const resp = await API.fetchTenantMedia()
      this.store.set(
        resp.assets.reduce((acc, item) => {
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
