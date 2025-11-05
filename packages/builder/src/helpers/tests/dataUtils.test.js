import { expect, describe, it } from "vitest"
import {
  breakQueryString,
  buildQueryString,
  customQueryText,
} from "../data/utils"
import { IntegrationTypes } from "@/constants/backend"

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

  it("should not encode a URL more than once when building the query string", () => {
    const queryString = buildQueryString({
      values: "a%2Cb%2Cc",
    })
    expect(queryString).toBe("values=a%2Cb%2Cc")
  })

  describe("customQueryText", () => {
    it("should remove the protocol", () => {
      const datasource = { source: IntegrationTypes.REST }
      const query = { name: "https://www.example.com" }

      const queryName = customQueryText(datasource, query)

      expect(queryName).toEqual("www.example.com")
    })

    it("should remove a trailing slash", () => {
      const datasource = { source: IntegrationTypes.REST }
      const query = { name: "test/" }

      const queryName = customQueryText(datasource, query)

      expect(queryName).toEqual("test")
    })

    it("should only use the path given a base url", () => {
      const datasource = { source: IntegrationTypes.REST }
      const query = { name: "www.example.com/api/health" }

      const queryName = customQueryText(datasource, query)

      expect(queryName).toEqual("/api/health")
    })

    it("should use the full path if the base is not a hostname", () => {
      const datasource = { source: IntegrationTypes.REST }
      const query = { name: "example/api/health" }

      const queryName = customQueryText(datasource, query)

      expect(queryName).toEqual("example/api/health")
    })
  })
})
