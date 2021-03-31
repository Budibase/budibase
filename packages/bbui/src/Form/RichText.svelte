<script>
  import Quill from "quill"
  import MarkdownIt from "markdown-it"
  import TurndownService from "turndown"
  import { onMount } from "svelte"
  import "quill/dist/quill.snow.css"

  const convertMarkdown = new MarkdownIt()
  convertMarkdown.set({
    html: true,
  })
  const turndownService = new TurndownService()

  export let value = ""
  export let options = null
  export let width = 400

  let quill
  let container
  let defaultOptions = {
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
      ],
    },
    placeholder: "Type something...",
    theme: "snow", // or 'bubble'
  }

  let mergedOptions = { ...defaultOptions, ...options }

  const updateContent = () => {
    value = turndownService.turndown(quill.container.firstChild.innerHTML)
  }

  onMount(() => {
    quill = new Quill(container, mergedOptions)
    if (value)
      quill.clipboard.dangerouslyPasteHTML(convertMarkdown.render(value + "\n"))

    quill.on("text-change", updateContent)
    return () => {
      quill.off("text-change", updateContent)
    }
  })
</script>

<svelte:head>
  {#if mergedOptions.theme !== 'snow'}
    <link
      rel="stylesheet"
      href="//cdn.quilljs.com/1.3.6/quill.{mergedOptions.theme}.css" />
  {/if}
</svelte:head>

<div style="width: {width}px">
  <div bind:this={container} />
</div>
