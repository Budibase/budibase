import { get } from "svelte/store"
import { setState } from "../../state/setState"
import { appStore } from "../../state/store"

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

export default {
  SET_STATE: ({ context, args, id }) => {
    // get props from the workflow context if required
    setState(...Object.values(args))
    // update the context with the data
    context = {
      ...context,
      [id]: args,
    }
  },
  NAVIGATE: ({ context, args, id }) => {},
  DELAY: async ({ context, args }) => await delay(args.time),
  FILTER: (context, args) => {
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
