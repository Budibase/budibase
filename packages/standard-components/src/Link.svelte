<script>
  import { cssVars, createClasses } from "./cssVars"

  export let url = ""
  export let text = ""
  export let openInNewTab = false
  export let color
  export let hoverColor
  export let underline = false
  export let fontSize

  export let _bb

  let anchorElement

  $: anchorElement && !text && _bb.attachChildren(anchorElement)
  $: target = openInNewTab ? "_blank" : "_self"
  $: cssVariables = {
    hoverColor,
    color,
    textDecoration: underline ? "underline" : "none",
    fontSize,
  }
  $: classes = createClasses(cssVariables)
</script>

<a
  href={url}
  bind:this={anchorElement}
  class={classes}
  {target}
  use:cssVars={cssVariables}>
  {text}
</a>

<style>
  .color {
    color: var(--color);
  }

  .hoverColor:hover {
    color: var(--color);
  }

  .textDecoration {
    text-decoration: var(--textDecoration);
  }

  .fontSize {
    font-size: var(--fontSize);
  }
</style>
