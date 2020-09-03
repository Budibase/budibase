const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

export default {
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
