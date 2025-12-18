import { writable } from "svelte/store"
import { PluginSource } from "@/constants/index"
import {
  Plugin,
  PluginUpdateInfo,
  PluginUpdateApplyRequest,
  PluginUpdateApplyResponse,
} from "@budibase/types"
import { API } from "@/api"

export function createPluginsStore() {
  const { subscribe, set, update } = writable<Plugin[]>([])
  const updatesStore = writable<PluginUpdateInfo[]>([])

  async function load() {
    const plugins: Plugin[] = await API.getPlugins()
    set(plugins)
  }

  async function deletePlugin(pluginId: string) {
    await API.deletePlugin(pluginId)
    update(state => {
      state = state.filter(existing => existing._id !== pluginId)
      return state
    })
  }

  async function createPlugin(source: string, url: string, auth = null) {
    let pluginData: any = {
      source,
      url,
    }

    switch (source) {
      case PluginSource.URL:
        pluginData.headers = auth
        break
      case PluginSource.GITHUB:
        pluginData.githubToken = auth
        break
    }

    let res = await API.createPlugin(pluginData)
    let newPlugin = res.plugin
    update(state => {
      const currentIdx = state.findIndex(plugin => plugin._id === newPlugin._id)
      if (currentIdx >= 0) {
        state.splice(currentIdx, 1, newPlugin)
      } else {
        state.push(newPlugin)
      }
      return state
    })
  }

  async function uploadPlugin(file: File) {
    if (!file) {
      return
    }
    let data = new FormData()
    data.append("file", file)
    let resp = await API.uploadPlugin(data)
    let newPlugin = resp.plugins[0]
    update(state => {
      const currentIdx = state.findIndex(plugin => plugin._id === newPlugin._id)
      if (currentIdx >= 0) {
        state.splice(currentIdx, 1, newPlugin)
      } else {
        state.push(newPlugin)
      }
      return state
    })
  }

  async function checkUpdates(token?: string) {
    const response = await API.checkPluginUpdates(token)
    updatesStore.set(response.updates || [])
    return response
  }

  async function applyUpdates(
    body: PluginUpdateApplyRequest = {},
    token?: string
  ): Promise<PluginUpdateApplyResponse> {
    const response = await API.applyPluginUpdates(body)
    await load()
    await checkUpdates(token)
    return response
  }
  return {
    subscribe,
    load,
    createPlugin,
    deletePlugin,
    uploadPlugin,
    updates: {
      subscribe: updatesStore.subscribe,
    },
    checkUpdates,
    applyUpdates,
  }
}

export const plugins = createPluginsStore()
