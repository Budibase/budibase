<script>
  import { cssVars, createClasses } from "./cssVars"

  export let className = ""
  export let onLoad
  export let type = "div"
  export let _bb

  let containerElement
  let hasLoaded
  let currentChildren

  $: {
    if (containerElement) {
      _bb.attachChildren(containerElement)
      if (!hasLoaded) {
        _bb.call("onLoad")
        hasLoaded = true
      }
    }
  }
</script>

{#if type === 'div'}
  <div bind:this={containerElement} />
{:else if type === 'header'}
  <header bind:this={containerElement} />
{:else if type === 'main'}
  <main bind:this={containerElement} />
{:else if type === 'footer'}
  <footer bind:this={containerElement} />
{:else if type === 'aside'}
  <aside bind:this={containerElement} />
{:else if type === 'summary'}
  <summary bind:this={containerElement} />
{:else if type === 'details'}
  <details bind:this={containerElement} />
{:else if type === 'article'}
  <article bind:this={containerElement} />
{:else if type === 'nav'}
  <nav bind:this={containerElement} />
{:else if type === 'mark'}
  <mark bind:this={containerElement} />
{:else if type === 'figure'}
  <figure bind:this={containerElement} />
{:else if type === 'figcaption'}
  <figcaption bind:this={containerElement} />
{:else if type === 'paragraph'}
  <p bind:this={containerElement} />
{/if}
