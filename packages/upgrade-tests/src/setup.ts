// Set longer timeout for upgrade tests
jest.setTimeout(60000)

// Add better error formatting
process.on("unhandledRejection", (error: any) => {
  if (error?.details) {
    console.error("Unhandled Budibase Error:", error.message)
    console.error("Details:", JSON.stringify(error.details, null, 2))
  }
})
