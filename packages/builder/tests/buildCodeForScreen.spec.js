import { buildCodeForScreens } from "../src/builderStore/buildCodeForScreens"

describe("buildCodeForScreen", () => {
  it("should package _code into runnable function, for simple screen props", () => {
    const screen = {
      props: {
        _id: "1234",
        _code: "render('render argument');",
      },
    }

    let renderArg
    const render = arg => {
      renderArg = arg
    }
    const uiFunctions = getFunctions(screen)

    const targetfunction = uiFunctions[screen.props._id]
    expect(targetfunction).toBeDefined()

    targetfunction(render)

    expect(renderArg).toBe("render argument")
  })

  it("should package _code into runnable function, for _children ", () => {
    const screen = {
      props: {
        _id: "parent",
        _code: "render('parent argument');",
        _children: [
          {
            _id: "child1",
            _code: "render('child 1 argument');",
          },
          {
            _id: "child2",
            _code: "render('child 2 argument');",
          },
        ],
      },
    }

    let renderArg
    const render = arg => {
      renderArg = arg
    }
    const uiFunctions = getFunctions(screen)

    const targetfunction = uiFunctions["child2"]
    expect(targetfunction).toBeDefined()

    targetfunction(render)

    expect(renderArg).toBe("child 2 argument")
  })
})

const getFunctions = screen => new Function(buildCodeForScreens([screen]))()
