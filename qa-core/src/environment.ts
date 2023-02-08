const env = {
  BUDIBASE_SERVER_URL: process.env.BUDIBASE_SERVER_URL,
  BUDIBASE_ACCOUNT_URL: process.env.BUDIBASE_ACCOUNT_URL,
  BUDIBASE_PUBLIC_API_KEY: process.env.BUDIBASE_PUBLIC_API_KEY,
  BUDIBASE_ACCOUNTS_URL: process.env.BUDIBASE_ACCOUNTS_URL,
  BUDIBASE_HOST: process.env.BUDIBASE_HOST,
  _set(key: any, value: any) {
    process.env[key] = value
    module.exports[key] = value
  },
}

export = env
