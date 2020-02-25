<script>
  import { cssVars, createClasses } from "./cssVars"

  export let className = ""
  export let onLoad
  export let type
  export let backgroundColor
  export let color
  export let borderWidth
  export let borderColor
  export let borderStyle
  export let _bb

  let containerElement
  let hasLoaded
  let currentChildren

  $: cssVariables = {
    backgroundColor,
    color,
    borderWidth,
    borderColor,
    borderStyle,
  }
  $: classes = `${createClasses(cssVariables)} ${className}`

  $: {
    if (containerElement) {
      _bb.attachChildren(containerElement)
      if (!hasLoaded) {
        _bb.call(onLoad)
        hasLoaded = true
      }
    }
  }
</script>

{#if type === 'div'}
  <div
    class={classes}
    bind:this={containerElement}
    use:cssVars={cssVariables} />
{:else if type === 'header'}
  <header
    class={classes}
    bind:this={containerElement}
    use:cssVars={cssVariables} />
{:else if type === 'main'}
  <main
    class={classes}
    bind:this={containerElement}
    use:cssVars={cssVariables} />
{:else if type === 'footer'}
  <footer
    class={classes}
    bind:this={containerElement}
    use:cssVars={cssVariables} />
{:else if type === 'aside'}
  <aside
    class={classes}
    bind:this={containerElement}
    use:cssVars={cssVariables} />
{:else if type === 'summary'}
  <summary
    class={classes}
    bind:this={containerElement}
    use:cssVars={cssVariables} />
{:else if type === 'details'}
  <details
    class={classes}
    bind:this={containerElement}
    use:cssVars={cssVariables} />
{:else if type === 'article'}
  <article
    class={classes}
    bind:this={containerElement}
    use:cssVars={cssVariables} />
{:else if type === 'nav'}
  <nav
    class={classes}
    bind:this={containerElement}
    use:cssVars={cssVariables} />
{:else if type === 'mark'}
  <mark
    class={classes}
    bind:this={containerElement}
    use:cssVars={cssVariables} />
{:else if type === 'figure'}
  <figure
    class={classes}
    bind:this={containerElement}
    use:cssVars={cssVariables} />
{:else if type === 'figcaption'}
  <figcaption
    class={classes}
    bind:this={containerElement}
    use:cssVars={cssVariables} />
{:else if type === 'paragraph'}
  <p class={classes} bind:this={containerElement} use:cssVars={cssVariables} />
{/if}

<style>
  .backgroundColor {
    background-color: var(--backgroundColor);
  }

  .color {
    color: var(--color);
  }

  .borderColor {
    border-color: var(--borderColor);
  }

  .borderWidth {
    border-width: var(--borderWidth);
  }

  .borderStyle {
    border-style: var(--borderStyle);
  }
</style>
