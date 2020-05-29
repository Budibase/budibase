import { writable } from "svelte/store";

const appStore = writable({});
appStore.actions = {

};

const routerStore = writable({});
routerStore.actions  = {

}

export {
  appStore,
  routerStore
}
