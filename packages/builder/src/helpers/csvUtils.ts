/**
 * Parses CSV content and filters out empty lines
 * @param csvString - Raw CSV content
 * @returns Array of email addresses with empty lines filtered out
 */
export function parseUserEmailsFromCSV(csvString: string): string[] {
  return csvString.split(/\r?\n/).filter(email => email.trim())
}
