import { SourceName } from "@budibase/types"

const mysqlErrorMessages: Record<number, string> = {
  1045: "Access denied for the specified user. User does not have the necessary privileges or the provided credentials are incorrect. Please verify the credentials, and ensure that the user has appropriate permissions.",
  1049: "The specified database does not exist. Please verify that the database name is correct.",
}

const postgresErrorMessages: Record<string, string> = {
  "23505": "Duplicate key value violates unique constraint.",
  "23502": "Null value not allowed for a column.",
  "23503": "Foreign key violation.",
  "23514": "Check constraint violation.",
  "42703": "Undefined column.",
  "42P01": "Undefined table.",
}

const sqlServerErrorMessages: Record<number, string> = {
  547: "The INSERT statement conflicted with the FOREIGN KEY constraint.",
  2601: "Cannot insert duplicate key row in object.",
  515: "Cannot insert the value NULL into column.",
}

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
