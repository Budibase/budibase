import {
  validatePages,
  validatePage,
} from "../src/components/userInterface/pagesParsing/validatePages"

const validPages = () => ({
  main: {
    index: {
      title: "My Cool App",
    },
    appBody: "./main.app.json",
  },
  unauthenticated: {
    index: {
      title: "My Cool App - Login",
    },
    appBody: "./unauthenticated.app.json",
  },
  componentLibraries: ["./myComponents"],
})

const getComponent = name =>
  ({
    testIndexHtml: {
      name: "testIndexHtml",
      props: {
        title: "string",
      },
    },
  }[name])

describe("validate single page", () => {
  it("should return no errors when page is valid", () => {
    const errors = validatePage(validPages().main, getComponent)

    expect(errors).toEqual([])
  })

  it("should return error when index is not set, or set incorrectly", () => {
    let page = validPages().main
    delete page.index
    expect(validatePage(page, getComponent).length).toEqual(1)
  })

  it("should return error when appBody is not set, or set incorrectly", () => {
    let page = validPages().main
    delete page.appBody
    expect(validatePage(page, getComponent).length).toEqual(1)

    page.appBody = true // not a string
    expect(validatePage(page, getComponent).length).toEqual(1)

    page.appBody = "something.js" // not a json
    expect(validatePage(page, getComponent).length).toEqual(1)
  })
})

describe("validate pages", () => {
  it("should return no errors when pages are valid", () => {
    const errors = validatePages(validPages(), getComponent)

    expect(errors).toEqual([])
  })

  it("should return error when component libraries not set", () => {
    const pages = validPages()

    delete pages.componentLibraries
    let errors = validatePages(pages, getComponent)
    expect(errors.length).toBe(1)

    pages.componentLibraries = []
    errors = validatePages(pages, getComponent)
    expect(errors.length).toBe(1)
  })

  it("should return error when no main or unauthenticated page", () => {
    let pages = validPages()
    delete pages.main
    let errors = validatePages(pages, getComponent)
    expect(errors.length).toBe(1)

    pages = validPages()
    delete pages.unauthenticated
    errors = validatePages(pages, getComponent)
    expect(errors.length).toBe(1)
  })

  it("should return error when page is invalid", () => {
    const pages = validPages()
    delete pages.main.index
    const errors = validatePages(pages, getComponent)
    expect(errors.length).toBe(1)
  })
})
