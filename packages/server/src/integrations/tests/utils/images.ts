import dotenv from "dotenv"
import { join } from "path"

const path = join(__dirname, "..", "..", "..", "..", "datasource-sha.env")
dotenv.config({
  path,
})

export function getImageSHAs() {
  return {
    mssql: `mcr.microsoft.com/mssql/server@${process.env.MSSQL_SHA}`,
    mysql: `mysql@${process.env.MYSQL_SHA}`,
    postgres: `postgres@${process.env.POSTGRES_SHA}`,
    mongodb: `mongo@${process.env.MONGODB_SHA}`,
    mariadb: `mariadb@${process.env.MARIADB_SHA}`,
  }
}
