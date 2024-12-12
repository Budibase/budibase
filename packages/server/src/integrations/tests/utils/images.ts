import dotenv from "dotenv"
import { join } from "path"

const path = join(__dirname, "..", "..", "..", "..", "datasource-sha.env")
dotenv.config({
  path,
})

export const MSSQL_IMAGE = `mcr.microsoft.com/mssql/server@${process.env.MSSQL_SHA}`
export const MYSQL_IMAGE = `mysql@${process.env.MYSQL_SHA}`
export const POSTGRES_IMAGE = `postgres@${process.env.POSTGRES_SHA}`
export const POSTGRES_LEGACY_IMAGE = `postgres:9.5.25`
export const MONGODB_IMAGE = `mongo@${process.env.MONGODB_SHA}`
export const MARIADB_IMAGE = `mariadb@${process.env.MARIADB_SHA}`
