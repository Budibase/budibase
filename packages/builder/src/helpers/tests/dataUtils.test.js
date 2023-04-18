import { expect, describe, it } from "vitest"
import { breakQueryString, buildQueryString } from "../data/utils"

describe("check query string utils", () => {
  const obj1 = {
    key1: "123",
    key2: "   ",
    key3: "333",
  }

  const obj2 = {
    key1: "{{ binding.awd }}",
    key2: "{{ binding.sed }}  ",
  }

  it("should build a basic query string", () => {
    const queryString = buildQueryString(obj1)
    expect(queryString).toBe("key1=123&key2=%20%20%20&key3=333")
  })

  it("should be able to break a basic query string", () => {
    const broken = breakQueryString("key1=123&key2=%20%20%20&key3=333")
    expect(broken.key1).toBe(obj1.key1)
    expect(broken.key2).toBe(obj1.key2)
    expect(broken.key3).toBe(obj1.key3)
  })

  it("should be able to build with a binding", () => {
    const queryString = buildQueryString(obj2)
    expect(queryString).toBe(
      "key1={{ binding.awd }}&key2={{ binding.sed }}%20%20"
    )
  })

  it("should be able to break with a binding", () => {
    const broken = breakQueryString(
      "key1={{ binding.awd }}&key2={{ binding.sed }}%20%20"
    )
    expect(broken.key1).toBe(obj2.key1)
    expect(broken.key2).toBe(obj2.key2)
  })
})
