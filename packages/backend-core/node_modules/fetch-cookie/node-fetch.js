module.exports = function nodeFetchCookieDecorator (nodeFetch, jar) {
  const fetchCookie = require('./')(nodeFetch, jar)

  return function nodeFetchCookie (url, userOptions = {}) {
    const opts = Object.assign({}, userOptions, { redirect: 'manual' })

    // Forward identical options to wrapped node-fetch but tell to not handle redirection.
    return fetchCookie(url, opts)
      .then(res => {
        const isRedirect = (res.status === 303 || res.status === 301 || res.status === 302 || res.status === 307)

        // Interpret the proprietary "redirect" option in the same way that node-fetch does.
        if (isRedirect && userOptions.redirect !== 'manual' && userOptions.follow !== 0) {
          const statusOpts = {
            // Since the "follow" flag is not relevant for node-fetch in this case,
            // we'll hijack it for our internal bookkeeping.
            follow: userOptions.follow !== undefined ? userOptions.follow - 1 : undefined
          }

          if (res.status !== 307) {
            statusOpts.method = 'GET'
            statusOpts.body = null
          }

          const redirectOpts = Object.assign({}, userOptions, statusOpts)

          return nodeFetchCookie(res.headers.get('location'), redirectOpts)
        } else {
          return res
        }
      })
  }
}
