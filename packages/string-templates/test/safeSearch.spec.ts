import { encodeJSBinding, processStringSync } from "../src"

describe("restricted search helpers", () => {
  const options = { safeSearchHelpers: true, noThrow: false }

  it.each([
    "{{ date }}",
    "{{ uuid }}",
    '{{ first (arrayify "target") }}',
    '{{ get "name" user }}',
    '{{ map user "name" }}',
  ])("rejects the disabled helper in %s", template => {
    expect(() => processStringSync(template, {}, options)).toThrow()
  })

  it("preserves the default helper and missing context bindings", () => {
    expect(
      processStringSync('{{ default user.missing "target" }}', {}, options)
    ).toBe("target")
  })

  it("preserves JavaScript bindings", () => {
    expect(
      processStringSync(encodeJSBinding('return "target"'), {}, options)
    ).toBe("target")
  })

  it("keeps unrestricted cached templates separate", () => {
    const template = '{{ first (arrayify "target") }}'
    processStringSync(template, {}, { cacheTemplates: true })

    expect(() =>
      processStringSync(template, {}, { ...options, cacheTemplates: true })
    ).toThrow()
    expect(processStringSync(template, {}, { cacheTemplates: true })).toBe(
      "target"
    )
  })
})
