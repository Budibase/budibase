const env = {
  BUDIBASE_SERVER_URL: process.env.BUDIBASE_SERVER_URL,
  BUDIBASE_PUBLIC_API_KEY: process.env.BUDIBASE_PUBLIC_API_KEY,
  _set(key: any, value: any) {
    process.env[key] = value
    module.exports[key] = value
  },
}

export = env
