import fs from "fs"
import path from "path"
import { IsolatedVM } from "../vm"
import { iifeWrapper } from "@budibase/string-templates"

function runJSWithIsolatedVM(script: string, context: Record<string, any>) {
  const runner = new IsolatedVM()
  return runner.withContext(context, () => {
    return runner.execute(iifeWrapper(script))
  })
}

describe("Test isolated vm directly", () => {
  it("should handle a very large file", () => {
    const marked = fs.readFileSync(
      path.join(__dirname, "largeJSExample.txt"),
      "utf-8"
    )
    const result = runJSWithIsolatedVM(marked, {
      trigger: { row: { Message: "dddd" } },
    })
    expect(result).toBe("<p>dddd</p>\n")
  })

  it("handle a mapping case", async () => {
    const context = {
      data: {
        data: {
          searchProducts: {
            results: [{ imageLinks: ["_S/"] }],
          },
        },
      },
    }
    const result = await runJSWithIsolatedVM(
      `
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
      `,
      context
    )
    expect(result).toBeDefined()
    expect(result.length).toBe(1)
    expect(result[0].imageLinks).toEqual([
      "https://budibase.com",
      "_S/",
      "https://budibase.com",
      "https://budibase.com",
      "https://budibase.com",
      "https://budibase.com",
    ])
  })

  it("should handle automation script example", () => {
    const context = {
      steps: [{}, { response: "hello" }, { items: [{ rows: [{ a: 1 }] }] }],
    }
    const result = runJSWithIsolatedVM(
      `const queryResults = steps[2].items;
      
      const intervals = steps[1].response;
      const whereNoItemsReturned = [];
      let index = 0;
      
      for (let queryResult of queryResults) {
        if (queryResult.rows.length === 0) {
          whereNoItemsReturned.push(intervals[index]);
        }
        index++;
      }
      
      return whereNoItemsReturned;
      `,
      context
    )
    expect(result).toEqual([])
  })
})
