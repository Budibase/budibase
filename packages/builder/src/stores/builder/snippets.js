import { writable } from "svelte/store"

const EXAMPLE_SNIPPETS = [
  {
    name: "Square",
    code: `
        return function(num) {
          return num * num
        }
      `,
  },
  {
    name: "HelloWorld",
    code: `
        return "Hello, world!"
      `,
  },
  {
    name: "Colorful",
    code: `
        let a = null
        let b = "asdasd"
        let c = 123123
        let d = undefined
        let e = [1, 2, 3]
        let f = { foo: "bar" }
        let g = Math.round(1.234)
        if (a === b) {
          return c ?? e
        }
        return d || f
        // comment
        let h = 1 + 2 + 3 * 3
        let i = true
        let j = false
      `,
  },
]

const createSnippetStore = () => {
  const store = writable(EXAMPLE_SNIPPETS)

  const syncMetadata = metadata => {
    store.set(metadata?.snippets || EXAMPLE_SNIPPETS)
  }

  const saveSnippet = updatedSnippet => {
    store.update(state => [
      ...state.filter(snippet => snippet.name !== updatedSnippet.name),
      updatedSnippet,
    ])
  }

  const deleteSnippet = snippetName => {
    store.update(state => state.filter(snippet => snippet.name !== snippetName))
  }

  return {
    ...store,
    syncMetadata,
    saveSnippet,
    deleteSnippet,
  }
}

export const snippetStore = createSnippetStore()
