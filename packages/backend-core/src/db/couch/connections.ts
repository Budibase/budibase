import env from "../../environment"

export const getCouchInfo = (connection?: string) => {
  const urlInfo = getUrlInfo(connection)
  let username
  let password
  if (urlInfo.auth?.username) {
    // set from url
    username = urlInfo.auth.username
  } else if (env.COUCH_DB_USERNAME) {
    // set from env
    username = env.COUCH_DB_USERNAME
  } else if (!env.isTest()) {
    throw new Error("CouchDB username not set")
  }
  if (urlInfo.auth?.password) {
    // set from url
    password = urlInfo.auth.password
  } else if (env.COUCH_DB_PASSWORD) {
    // set from env
    password = env.COUCH_DB_PASSWORD
  } else if (!env.isTest()) {
    throw new Error("CouchDB password not set")
  }
  const authCookie = Buffer.from(`${username}:${password}`).toString("base64")
  return {
    url: urlInfo.url!,
    auth: {
      username: username,
      password: password,
    },
    cookie: `Basic ${authCookie}`,
  }
}

export const getUrlInfo = (url = env.COUCH_DB_URL) => {
  let cleanUrl, username, password, host
  if (url) {
    // Ensure the URL starts with a protocol
    const protoRegex = /^https?:\/\//i
    if (!protoRegex.test(url)) {
      url = `http://${url}`
    }

    // Split into protocol and remainder
    const split = url.split("://")
    const protocol = split[0]
    const rest = split.slice(1).join("://")

    // Extract auth if specified
    if (url.includes("@")) {
      // Split into host and remainder
      let parts = rest.split("@")
      host = parts[parts.length - 1]
      let auth = parts.slice(0, -1).join("@")

      // Split auth into username and password
      if (auth.includes(":")) {
        const authParts = auth.split(":")
        username = authParts[0]
        password = authParts.slice(1).join(":")
      } else {
        username = auth
      }
    } else {
      host = rest
    }
    cleanUrl = `${protocol}://${host}`
  }
  return {
    url: cleanUrl,
    auth: {
      username,
      password,
    },
  }
}
