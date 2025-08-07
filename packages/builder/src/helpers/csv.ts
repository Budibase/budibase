export function parseUserEmailsFromCSV(csvString: string): string[] {
  return csvString.split(/\r?\n/).filter(email => email.trim())
}
