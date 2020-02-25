const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))

exports.timeout = timeout

module.exports.sleep = async (ms, fn, ...args) => {
  await timeout(ms)
  return await fn(...args)
}
