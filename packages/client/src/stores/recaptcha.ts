import { API } from "@/api"
import { writable } from "svelte/store"

type RecaptchaState = {
  verified?: boolean
}

const createRecaptchaStore = () => {
  const store = writable<RecaptchaState>({ verified: false })

  const checkVerified = async () => {
    const { verified } = await API.recaptcha.check()
    store.update(state => {
      state.verified = verified
      return state
    })
  }

  const unverified = () => {
    store.update(state => {
      state.verified = false
      return state
    })
  }

  return {
    subscribe: store.subscribe,
    actions: { checkVerified, unverified },
  }
}

export const recaptchaStore = createRecaptchaStore()
