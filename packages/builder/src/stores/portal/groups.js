import { writable } from "svelte/store"
import { API } from "api"
import { update } from "lodash"

export function createGroupsStore() {
    const { subscribe, set } = writable([])

    async function init() {
        const users = await API.getGroups()
        set(users)
    }

    async function save(data) {
        await API.saveGroup(data)
    }

    return {
        subscribe,
        init,
        save,
    }
}

export const groups = createGroupsStore()
