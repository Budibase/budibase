import { describe, it, expect } from "vitest"
import { parseUserEmailsFromCSV } from "../csv"

describe("parseUserEmailsFromCSV", () => {
  it("should filter out empty lines from CSV content", () => {
    const csvContent =
      "user1@example.com\n\nuser2@example.com\n\n\nuser3@example.com\n"

    const result = parseUserEmailsFromCSV(csvContent)

    expect(result).toEqual([
      "user1@example.com",
      "user2@example.com",
      "user3@example.com",
    ])
  })

  it("should handle CSV with only whitespace lines", () => {
    const csvContent = "user1@example.com\n   \n\t\nuser2@example.com\n    \n"

    const result = parseUserEmailsFromCSV(csvContent)

    expect(result).toEqual(["user1@example.com", "user2@example.com"])
  })

  it("should handle CSV with Windows line endings (\\r\\n)", () => {
    const csvContent = "user1@example.com\r\n\r\nuser2@example.com\r\n"

    const result = parseUserEmailsFromCSV(csvContent)

    expect(result).toEqual(["user1@example.com", "user2@example.com"])
  })

  it("should handle CSV that ends with empty lines", () => {
    const csvContent = "user1@example.com\nuser2@example.com\n\n\n\n"

    const result = parseUserEmailsFromCSV(csvContent)

    expect(result).toEqual(["user1@example.com", "user2@example.com"])
  })

  it("should handle CSV that starts with empty lines", () => {
    const csvContent = "\n\n\nuser1@example.com\nuser2@example.com"

    const result = parseUserEmailsFromCSV(csvContent)

    expect(result).toEqual(["user1@example.com", "user2@example.com"])
  })

  it("should handle a file with only empty lines", () => {
    const csvContent = "\n\n\n   \n\t\n"

    const result = parseUserEmailsFromCSV(csvContent)

    expect(result).toEqual([])
  })

  it("should handle mixed valid and empty lines", () => {
    const csvContent = "\n\nuser1@example.com\n   \nuser2@example.com\n\t\n\n"

    const result = parseUserEmailsFromCSV(csvContent)

    expect(result).toEqual(["user1@example.com", "user2@example.com"])
  })

  it("should handle empty string input", () => {
    const csvContent = ""

    const result = parseUserEmailsFromCSV(csvContent)

    expect(result).toEqual([])
  })

  it("should handle mixed line endings", () => {
    const csvContent =
      "user1@example.com\nuser2@example.com\r\nuser3@example.com\ruser4@example.com"

    const result = parseUserEmailsFromCSV(csvContent)

    expect(result).toEqual([
      "user1@example.com",
      "user2@example.com",
      "user3@example.com\ruser4@example.com", // Note: \r alone doesn't split, only \r\n and \n
    ])
  })

  it("should preserve whitespace within email addresses", () => {
    const csvContent =
      "user1@example.com\n user2@example.com \nuser3@example.com"

    const result = parseUserEmailsFromCSV(csvContent)

    expect(result).toEqual([
      "user1@example.com",
      " user2@example.com ", // Preserves leading/trailing spaces in email addresses
      "user3@example.com",
    ])
  })
})
