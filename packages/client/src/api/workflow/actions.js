import { get } from "svelte/store"
import { setState } from "../../state/setState"
import { appStore } from "../../state/store"

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

export default {
  SET_STATE: ({ context, args, id }) => {
    setState(...Object.values(args))
    context = {
      ...context,
      [id]: args,
    }
  },
  NAVIGATE: ({ context, args, id }) => {
    // TODO client navigation
  },
  DELAY: async ({ context, args }) => await delay(args.time),
  FILTER: ({ context, args }) => {
    const { field, condition, value } = args
    switch (condition) {
      case "equals":
        if (field !== value) return
        break
      default:
        return
    }
  },
}
