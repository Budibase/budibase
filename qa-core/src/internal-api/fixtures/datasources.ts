// Add information about the data source to the fixtures file from 1password

export const mongoDB = () => {
  return {
    datasource: {
      name: "MongoDB",
      source: "MONGODB",
      type: "datasource",
      config: {
        connectionString: "",
        db: "",
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
        database: "",
        host: "",
        password: "",
        port: 1111,
        schema: "public",
        user: "",
      },
    },
    fetchSchema: true,
  }
}
