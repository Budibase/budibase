import { plainTextProcessor } from "../plainText"

describe("plainTextProcessor", () => {
  it("chunks utf-8 plain text content", async () => {
    const content = "This is a plain text document."

    const chunks = await plainTextProcessor.process({
      buffer: Buffer.from(content, "utf-8"),
    })

    expect(chunks).toEqual(["This is a plain text document."])
  })
})
