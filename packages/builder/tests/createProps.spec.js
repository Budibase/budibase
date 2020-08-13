import { createProps } from "../src/components/userInterface/pagesParsing/createProps"
import { keys, some } from "lodash/fp"
import { stripStandardProps } from "./testData"

describe("createDefaultProps", () => {
  const getcomponent = () => ({
    _component: "some_component",
    name: "some_component",
    props: {
      fieldName: { type: "string", default: "something" },
    },
  })

  it("should create a object with single string value, when default string field set", () => {
    const { props, errors } = createProps(getcomponent())

    expect(errors).toEqual([])
    expect(props.fieldName).toBeDefined()
    expect(props.fieldName).toBe("something")
    stripStandardProps(props)
    expect(keys(props).length).toBe(3)
  })

  it("should set component _component", () => {
    const { props, errors } = createProps(getcomponent())

    expect(errors).toEqual([])
    expect(props._component).toBe("some_component")
  })

  it("should create a object with single blank string value, when prop definition is 'string' ", () => {
    const comp = getcomponent()
    comp.props.fieldName = "string"

    const { props, errors } = createProps(comp)

    expect(errors).toEqual([])
    expect(props.fieldName).toBeDefined()
    expect(props.fieldName).toBe("")
  })

  it("should create a object with single fals value, when prop definition is 'bool' ", () => {
    const comp = getcomponent()
    comp.props.isVisible = "bool"

    const { props, errors } = createProps(comp)

    expect(errors).toEqual([])
    expect(props.isVisible).toBeDefined()
    expect(props.isVisible).toBe(false)
  })

  it("should create a object with single 0 value, when prop definition is 'number' ", () => {
    const comp = getcomponent()
    comp.props.width = "number"

    const { props, errors } = createProps(comp)

    expect(errors).toEqual([])
    expect(props.width).toBeDefined()
    expect(props.width).toBe(0)
  })

  it("should create a object with empty _children array, when children===true ", () => {
    const comp = getcomponent()
    comp.children = true

    const { props, errors } = createProps(comp)

    expect(errors).toEqual([])
    expect(props._children).toBeDefined()
    expect(props._children).toEqual([])
  })

  it("should create a object with single empty array, when prop definition is 'event' ", () => {
    const comp = getcomponent()
    comp.props.onClick = "event"

    const { props, errors } = createProps(comp)

    expect(errors).toEqual([])
    expect(props.onClick).toBeDefined()
    expect(props.onClick).toEqual([])
  })

  it("should create a object children array when children == true ", () => {
    const comp = getcomponent()
    comp.children = true

    const { props, errors } = createProps(comp)

    expect(errors).toEqual([])
    expect(props._children).toBeDefined()
    expect(props._children).toEqual([])
  })

  it("should always create _children ", () => {
    const comp = getcomponent()
    comp.children = false

    const createRes1 = createProps(comp)

    expect(createRes1.errors).toEqual([])
    expect(createRes1.props._children).toBeDefined()

    const comp2 = getcomponent()
    comp2.children = true

    const createRes2 = createProps(comp)

    expect(createRes2.errors).toEqual([])
    expect(createRes2.props._children).toBeDefined()
  })

  it("should create an object with multiple prop names", () => {
    const comp = getcomponent()
    comp.props.fieldName = "string"
    comp.props.fieldLength = { type: "number", default: 500 }

    const { props, errors } = createProps(comp)

    expect(errors).toEqual([])
    expect(props.fieldName).toBeDefined()
    expect(props.fieldName).toBe("")
    expect(props.fieldLength).toBeDefined()
    expect(props.fieldLength).toBe(500)
  })

  it("should return error when invalid type", () => {
    const comp = getcomponent()
    comp.props.fieldName = "invalid type name"
    comp.props.fieldLength = { type: "invalid type name " }

    const { errors } = createProps(comp)

    expect(errors.length).toBe(2)
    expect(some(e => e.propName === "fieldName")(errors)).toBeTruthy()
    expect(some(e => e.propName === "fieldLength")(errors)).toBeTruthy()
  })

  it("should merge in derived props", () => {
    const comp = getcomponent()
    comp.props.fieldName = "string"
    comp.props.fieldLength = { type: "number", default: 500 }

    const derivedFrom = {
      fieldName: "surname",
    }

    const { props, errors } = createProps(comp, derivedFrom)

    expect(errors.length).toBe(0)
    expect(props.fieldName).toBe("surname")
    expect(props.fieldLength).toBe(500)
  })

  it("should create standard props", () => {
    const comp = getcomponent()
    comp.props.fieldName = { type: "string", default: 1 }
    const { props } = createProps(comp)
    expect(props._code).toBeDefined()
    expect(props._styles).toBeDefined()
    expect(props._code).toBeDefined()
  })
})
