<script lang="ts">
  import { getContext } from "svelte"
  import { MarkdownViewer } from "@budibase/bbui"

  export let text: string = ""
  export let color: string | undefined = undefined
  export let align: "left" | "center" | "right" | "justify" = "left"

  const component = getContext("component")
  const { styleable } = getContext("sdk")

  // Add in certain settings to styles
  $: styles = enrichStyles($component.styles, color, align)

  const enrichStyles = (
    styles: any,
    colorStyle: typeof color,
    alignStyle: typeof align
  ) => {
    let additions: Record<string, string> = {
      "text-align": alignStyle,
    }
    if (colorStyle) {
      additions.color = colorStyle
    }
    return {
      ...styles,
      normal: {
        ...styles.normal,
        ...additions,
      },
    }
  }
</script>

<div use:styleable={styles}>
  <MarkdownViewer value={text} />
</div>

<style>
  div :global(img) {
    max-width: 100%;
  }
  div :global(.editor-preview-full) {
    height: auto;
  }
</style>
