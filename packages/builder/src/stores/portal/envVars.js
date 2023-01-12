import { writable } from "svelte/store"
import { API } from "api"

export function createEnvVarsStore() {
    const { subscribe, set, update } = writable([])

    async function load() {
        // const envVars = await API.fetchEnvVars()

        let testVars = ['blah', 'blah123']

        // turn the testVars array in to a map with "name" being the value of each
        // item in the array
        const vars = testVars.map((name) => ({ name }))
        console.log(vars)
        set(vars)
    }

    return {
        subscribe,
        load,
    }
}

export const envVars = createEnvVarsStore()
