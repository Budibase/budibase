import { get, writable } from "svelte/store";
import * as API from "../api";
import { builderStore } from "./builder";

const createAppStore = () => {
  const store = writable(null);

  const fetchPackage = async () => {
    const appDefinition = await API.fetchAppPackage(get(builderStore).appId)
    store.set(appDefinition.application);
  }

  return {
    subscribe: store.subscribe,
    actions: { fetchPackage },
  }
}

export const appStore = createAppStore()
