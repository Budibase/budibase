import { API } from "@/api"
import { downloadStream } from "@budibase/frontend-core"
import type {
  CreatePlaybookRequest,
  ImportPlaybookRequest,
  ImportPlaybookResponse,
  PlaybookResponse,
  UpdatePlaybookRequest,
} from "@budibase/types"
import { BudiStore } from "../BudiStore"

class PlaybooksStore extends BudiStore<PlaybookResponse[]> {
  constructor() {
    super([])
  }

  fetch = async () => {
    const { playbooks } = await API.playbooks.fetch()
    this.set(playbooks)
    return playbooks
  }

  create = async (playbook: CreatePlaybookRequest) => {
    const response = await API.playbooks.create(playbook)
    this.update(state => [...state, response.playbook])
    return response.playbook
  }

  exportPlaybook = async (
    id: string,
    body?: {
      encryptPassword?: string
    }
  ) => {
    const response = await API.playbooks.exportBundle(id, body)
    await downloadStream(response)
  }

  importPlaybook = async (
    file: File,
    body?: ImportPlaybookRequest
  ): Promise<ImportPlaybookResponse> => {
    const response = await API.playbooks.importBundle(file, body)
    await this.fetch()
    return response
  }

  updatePlaybook = async (playbook: UpdatePlaybookRequest) => {
    const response = await API.playbooks.update(playbook)
    this.update(state =>
      state.map(existing =>
        existing._id === response.playbook._id ? response.playbook : existing
      )
    )
    return response.playbook
  }

  deletePlaybook = async (id: string, rev: string) => {
    await API.playbooks.delete(id, rev)
    this.update(state => state.filter(playbook => playbook._id !== id))
  }
}

export const playbooksStore = new PlaybooksStore()
