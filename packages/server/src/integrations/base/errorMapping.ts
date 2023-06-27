import { SourceName } from "@budibase/types"

const mysqlErrorMessages: Record<number, string> = {
  1045: "Access denied for the specified user. User does not have the necessary privileges or the provided credentials are incorrect. Please verify the credentials, and ensure that the user has appropriate permissions.",
  1049: "The specified database does not exist. Please verify that the database name is correct.",
}

const postgresErrorMessages: Record<number, string> = {
  28: "Connection timed out. Please verify that the database host and port are correct, and that the database is accepting TCP/IP connections.",
  3: "Connection timed out. Please verify that the database host and port are correct, and that the database is accepting TCP/IP connections.",
  4: "Connection refused. Please verify that the database host and port are correct, and that the database is accepting TCP/IP connections.",
  1017: "Access denied for the specified user. User does not have the necessary privileges or the provided credentials are incorrect. Please verify the credentials, and ensure that the user has appropriate permissions.",
  1049: "The specified database does not exist. Please verify that the database name is correct.",
}

const sqlServerErrorMessages: Record<number, string> = {}

export const getReadableErrorMessage = (type: string, errno: number) => {
  switch (type) {
    case SourceName.MYSQL:
      return mysqlErrorMessages[errno]
    case SourceName.POSTGRES:
      return postgresErrorMessages[errno]
    case SourceName.SQL_SERVER:
      return sqlServerErrorMessages[errno]
  }
}
