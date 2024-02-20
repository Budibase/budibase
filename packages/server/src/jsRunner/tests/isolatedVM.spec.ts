import fs from "fs"
import path from "path"
import { IsolatedVM, VM2 } from "../vm"

function runJSWithIsolatedVM(script: string, context?: any) {
  const runner = new IsolatedVM()
  if (context) {
    runner.withContext(context)
  }
  return runner.execute(`(function(){\n${script}\n})();`)
}

function runJSWithVM2(script: string, context?: any) {
  const runner = new VM2(context)
  return runner.execute(script)
}

function compare(script: string, context?: any) {
  const resultIsolated = runJSWithIsolatedVM(script, context)
  const resultVM = runJSWithVM2(script, context)
  expect(resultIsolated).toEqual(resultVM)
  return resultIsolated
}

describe("Test isolated vm directly", () => {
  it("should handle a very large file", () => {
    const marked = fs.readFileSync(path.join(__dirname, "marked.txt"), "utf-8")
    const result = compare(marked, {
      trigger: { row: { Message: "dddd" } },
    })
    expect(result).toBe("<p>dddd</p>\n")
  })

  it("handle a mapping case", async () => {
    const context = {
      data: {
        data: {
          searchProducts: {
            results: [
              { imageLinks: ["_S/"] }
            ]
          }
        }
      }
    }
    const result = await compare(`
      const dataUnnested = data.data.searchProducts.results
      const emptyLink = "https://budibase.com"
      let pImage = emptyLink
      let sImage = emptyLink
      let uImage = emptyLink
      let lImage = emptyLink
      let b1Image = emptyLink
      let b2Image = emptyLink

      const dataTransformed = dataUnnested.map(x=> {
        let imageLinks = x.imageLinks
        for (let i = 0; i < imageLinks.length; i++){ 
          if(imageLinks[i].includes("_P/") || imageLinks[i].includes("_p/")){
            pImage = imageLinks[i]
          } else if (imageLinks[i].includes("_S/") || imageLinks[i].includes("_s/")){
            sImage = imageLinks[i]
          } else if (imageLinks[i].includes("_U/") || imageLinks[i].includes("_u/")){
            uImage = imageLinks[i]
          } else if (imageLinks[i].includes("_L/") || imageLinks[i].includes("_l/")){
            lImage = imageLinks[i]
          } else if (imageLinks[i].includes("_B/") || imageLinks[i].includes("_b/")){
            b1Image = imageLinks[i]
          } else if (imageLinks[i].includes("_B2/") || imageLinks[i].includes("_b2/")){
            b2Image = imageLinks[i]
          }
        }

        const arrangedLinks = [pImage, sImage, uImage, lImage, b1Image, b2Image]
        x.imageLinks = arrangedLinks

        return x
      })

      return dataTransformed
      `, context)
    expect(result).toBeDefined()
    expect(result.length).toBe(1)
    expect(result[0].imageLinks.length).toBe(6)
  })
})
