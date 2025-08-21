<script lang="ts">
  import { getContext } from "svelte"
  import { MarkdownViewer } from "@budibase/bbui"

  export let text: any = ""
  export let color: string | undefined = undefined
  export let align: "left" | "center" | "right" | "justify" = "left"
  export let size: string | undefined = "14px"

  const component = getContext("component")
  const { styleable } = getContext("sdk")

  // Add in certain settings to styles
  $: styles = enrichStyles($component.styles, color, align, size)

  // Ensure we're always passing in a string value to the markdown editor
  $: safeText = stringify(text)

  const enrichStyles = (
    styles: any,
    colorStyle: typeof color,
    alignStyle: typeof align,
    size: string | undefined
  ) => {
    let additions: Record<string, string> = {
      "text-align": alignStyle,
      "font-size": size || "14px",
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

  const stringify = (text: any): string => {
    if (text == null) {
      return ""
    }
    if (typeof text !== "string") {
      try {
        return JSON.stringify(text)
      } catch (e) {
        return ""
      }
    }
    return text
  }
</script>

<div use:styleable={styles}>
  <MarkdownViewer value={safeText} />
</div>

<style>
  div :global(img) {
    max-width: 100%;
  }
  div :global(.editor-preview-full) {
    height: auto;
  }
  div :global(h1),
  div :global(h2),
  div :global(h3),
  div :global(h4),
  div :global(h5),
  div :global(h6) {
    font-weight: 600;
  }

  /* Slightly shrink h1 so that it fits into 2 grid rows by default */
  div :global(h1) {
    font-size: 1.8em;
  }
</style>
