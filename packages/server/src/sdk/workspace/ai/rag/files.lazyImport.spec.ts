describe("rag files lazy imports", () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it("does not load pdf-parse when the module is imported", () => {
    jest.doMock("pdf-parse", () => {
      throw new Error("pdf-parse should not be loaded eagerly")
    })

    jest.doMock("../vectorDb/utils", () => ({
      createVectorDb: jest.fn(),
    }))

    jest.doMock("ai", () => ({
      tool: jest.fn(),
      embedMany: jest.fn(),
    }))

    jest.doMock("../llm", () => ({
      createLLM: jest.fn(),
    }))

    jest.doMock("..", () => ({
      knowledgeBase: {
        find: jest.fn(),
      },
    }))

    expect(() => {
      jest.isolateModules(() => {
        require("./files")
      })
    }).not.toThrow()
  })
})
