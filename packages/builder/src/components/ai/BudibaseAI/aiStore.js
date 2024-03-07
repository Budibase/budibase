import { writable, get } from "svelte/store"
import { Models } from "./constants";

const initialState = {
  model: Models.ChatGPT
}

export default writable(initialState)
