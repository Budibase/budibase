import { SourceName } from "@budibase/types"

const mysqlErrorMessages: Record<number, string> = {
  1045: "Access denied for the specified user. User does not have the necessary privileges or the provided credentials are incorrect. Please verify the credentials, and ensure that the user has appropriate permissions.",
  1049: "The specified database does not exist. Please verify that the database name is correct.",
}

const postgresErrorMessages: Record<number, string> = {}

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
