import { expandComponentDefinition } from "../src/components/userInterface/pagesParsing/types"

const componentDef = () => ({
  name: "comp",
  props: {
    label: "string",
    width: { type: "number" },
    color: { type: "string", required: true },
  },
})

describe("expandPropDefintion", () => {
  it("should expand property defined as string, into default for that type", () => {
    const result = expandComponentDefinition(componentDef())

    expect(result.props.label.type).toBe("string")
    expect(result.props.label.required).toBe(false)
  })

  it("should add members to property defined as object, when members do not exist", () => {
    const result = expandComponentDefinition(componentDef())
    expect(result.props.width.required).toBe(false)
  })

  it("should not override existing memebers", () => {
    const result = expandComponentDefinition(componentDef())
    expect(result.props.color.required).toBe(true)
  })

  it("should set children=true when not included", () => {
    const result = expandComponentDefinition(componentDef())
    expect(result.children).toBe(true)
  })

  it("should not change children when specified", () => {
    const c = componentDef()
    c.children = false
    const result = expandComponentDefinition(c)
    expect(result.children).toBe(false)

    c.children = true
    const result2 = expandComponentDefinition(c)
    expect(result2.children).toBe(true)
  })
})
