import { writable } from "svelte/store"
import { API } from "api"
import { PluginSource } from "constants"

export function createPluginsStore() {
  const { subscribe, set, update } = writable([])

  async function load() {
    const plugins = await API.getPlugins()
    set(plugins)
  }

  async function deletePlugin(pluginId) {
    await API.deletePlugin(pluginId)
    update(state => {
      state = state.filter(existing => existing._id !== pluginId)
      return state
    })
  }

  async function createPlugin(source, url, auth = null) {
    let pluginData = {
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

  async function uploadPlugin(file) {
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
  return {
    subscribe,
    load,
    createPlugin,
    deletePlugin,
    uploadPlugin,
  }
}

export const plugins = createPluginsStore()
