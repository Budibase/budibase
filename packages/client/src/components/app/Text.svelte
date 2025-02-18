<script lang="ts">
  import { getContext } from "svelte"
  import { MarkdownViewer } from "@budibase/bbui"

  export let text: string = ""
  export let color: string | undefined = undefined

  const component = getContext("component")
  const { styleable } = getContext("sdk")

  // Add in certain settings to styles
  $: styles = enrichStyles($component.styles, color)

  const enrichStyles = (styles: any, color: string | undefined) => {
    if (!color) {
      return styles
    }
    return {
      ...styles,
      normal: {
        ...styles?.normal,
        color,
      },
    }
  }
</script>

<div use:styleable={styles}>
  <MarkdownViewer value={text} />
</div>

<style>
</style>
