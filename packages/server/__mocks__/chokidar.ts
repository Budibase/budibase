const watcher = {
  on: () => watcher,
  close: () => Promise.resolve(),
}

export default {
  watch: () => watcher,
}
