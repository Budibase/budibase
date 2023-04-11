// Add information about the data source to the fixtures file from 1password
export const mongoDB = () => {
  return {
    datasource: {
      name: "MongoDB",
      source: "MONGODB",
      type: "datasource",
      config: {
        connectionString: process.env.MONGODB_CONNECTION_STRING,
        db: process.env.MONGODB_DB,
      },
    },

    fetchSchema: false,
  }
}

export const postgresSQL = () => {
  return {
    datasource: {
      name: "PostgresSQL",
      plus: true,
      source: "POSTGRES",
      type: "datasource",
      config: {
        database: process.env.POSTGRES_DB,
        host: process.env.POSTGRES_HOST,
        password: process.env.POSTGRES_PASSWORD,
        port: process.env.POSTGRES_PORT,
        schema: "public",
        user: process.env.POSTGRES_USER,
      },
    },
    fetchSchema: true,
  }
}

// Add the data source for MariaDB to the this file in the same style as above
export const mariaDB = () => {
  return {
    datasource: {
      name: "MariaDB",
      plus: true,
      source: "MYSQL",
      type: "datasource",
      config: {
        database: process.env.MARIADB_DB,
        host: process.env.MARIADB_HOST,
        password: process.env.MARIADB_PASSWORD,
        port: process.env.MARIADB_PORT,
        schema: "public",
        user: process.env.MARIADB_USER,
      },
    },
    fetchSchema: true,
  }
}
