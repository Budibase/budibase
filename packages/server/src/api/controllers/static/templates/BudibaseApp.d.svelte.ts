declare const svelte: {
  render(any): SvelteReturn
}

export interface SvelteReturn {
  head: any
  html: any
  css: any
}

export default svelte
