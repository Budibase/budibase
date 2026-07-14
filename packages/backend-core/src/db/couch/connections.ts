import env from "../../environment"

export const getCouchInfo = () => {
  return parseCouchInfo(env.COUCH_DB_URL, {
    user: env.COUCH_DB_USERNAME || "",
    password: env.COUCH_DB_PASSWORD || "",
  })
}

export const parseCouchInfo = (
  connection: string,
  credentials?: { user: string; password: string }
) => {
  // clean out any auth credentials
  const urlInfo = getUrlInfo(connection)
  let username
  let password
  if (urlInfo.auth?.username) {
    // set from url
    username = urlInfo.auth.username
  } else if (credentials?.user) {
    username = credentials?.user
  } else {
    throw new Error("CouchDB username not set")
  }
  if (urlInfo.auth?.password) {
    // set from url
    password = urlInfo.auth.password
  } else if (credentials?.password) {
    password = credentials?.password
  } else {
    throw new Error("CouchDB password not set")
  }
  const authCookie = Buffer.from(`${username}:${password}`).toString("base64")
  let sqlUrl = env.COUCH_DB_SQL_URL
  if (!sqlUrl && urlInfo.url) {
    const parsed = new URL(urlInfo.url)
    parsed.port = env.COUCH_DB_SQS_PORT
    sqlUrl = parsed.toString().replace(/\/$/, "")
  }
  return {
    url: urlInfo.url!,
    // clean out any auth credentials
    sqlUrl: getUrlInfo(sqlUrl).url,
    auth: {
      username: username,
      password: password,
    },
    cookie: `Basic ${authCookie}`,
  }
}

export const getUrlInfo = (url: string | null = env.COUCH_DB_URL) => {
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
