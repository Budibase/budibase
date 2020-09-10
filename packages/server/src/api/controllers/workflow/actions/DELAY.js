const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

module.exports = async function delay({ args }) {
  await wait(args.time)
}
