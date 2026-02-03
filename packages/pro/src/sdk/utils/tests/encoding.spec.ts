import * as encoding from "../encoding"

describe("encoding", () => {
  describe("objectToBase64 / base64ToObject", () => {
    const object = {
      string: "string",
      number: 1,
      boolean: true,
      array: [1, "2"],
      object: {
        foo: "bar",
      },
    }
    it("converts between object and base64", () => {
      const base64 = encoding.objectToBase64(object)
      const deserialized = encoding.base64ToObject(base64)
      expect(deserialized).toEqual(object)
    })
  })
})
