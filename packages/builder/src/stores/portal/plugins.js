import { writable } from "svelte/store"
import { API } from "api"

export function createPluginsStore() {
  const { subscribe, set, update } = writable([])

  async function load() {
    const plugins = await API.getPlugins()
    set(plugins)
  }

  async function deletePlugin(pluginId, pluginRev) {
    await API.deletePlugin(pluginId, pluginRev)
    update(state => {
      state = state.filter(existing => existing._id !== pluginId)
      return state
    })
  }

  async function createPlugin(type, source, name, url, auth) {
    let pluginData = {
      type,
      source,
      name,
      url,
    }

    switch (source) {
      case "github":
        pluginData.githubToken = auth
        break
      case "url":
        pluginData.header = auth
        break
      case "npm":
        pluginData.npmToken = auth
        break
    }

    let resp = await API.createPlugin(pluginData)
    console.log(resp)
    // TODO_RIC
    // let newPlugin = resp.plugins[0]
    // update(state => {
    //   const currentIdx = state.findIndex(plugin => plugin._id === newPlugin._id)
    //   if (currentIdx >= 0) {
    //     state.splice(currentIdx, 1, newPlugin)
    //   } else {
    //     state.push(newPlugin)
    //   }
    //   return state
    // })
  }

  async function uploadPlugin(file, source) {
    let data = new FormData()
    data.append("file", file)
    let resp = await API.uploadPlugin(data, source)
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
