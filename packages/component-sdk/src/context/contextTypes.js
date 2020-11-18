import { getContext } from "svelte"

export const DataProvider = "bb-data-provider"

export const asd = () => getContext(DataProvider)
