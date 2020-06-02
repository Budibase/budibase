import { setState } from "../../state/setState"

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

export default {
  SET_STATE: ({ context, args, id }) => {
    setState(...Object.values(args))
    context = {
      ...context,
      [id]: args,
    }
    return context
  },
  NAVIGATE: () => {
    // TODO client navigation
  },
  DELAY: async ({ args }) => await delay(args.time),
  FILTER: ({ args }) => {
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
