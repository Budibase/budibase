import { gunzipFromBase64, gzipToBase64, GZIP_PREFIX } from ".."

describe("gzip utils", () => {
  it("round trips data with prefix", async () => {
    const input = JSON.stringify({ name: "Budibase", count: 42 })
    const encoded = await gzipToBase64(input)

    expect(encoded.startsWith(GZIP_PREFIX)).toBe(true)
    await expect(gunzipFromBase64(encoded)).resolves.toBe(input)
  })

  it("handles payloads without prefix", async () => {
    const input = "plain text payload"
    const encoded = await gzipToBase64(input)
    const withoutPrefix = encoded.slice(GZIP_PREFIX.length)

    await expect(gunzipFromBase64(withoutPrefix)).resolves.toBe(input)
  })
})
