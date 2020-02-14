<script>
  export let className = ""
  export let onLoad
  export let type
  export let _bb

  let containerElement
  let hasLoaded;
  let currentChildren;

  $: {
    if(containerElement) {
       _bb.attachChildren(containerElement)
       if (!hasLoaded) {
         _bb.call(onLoad)
         hasLoaded = true
       }
    }
  }

</script>

{#if type === "div"}
<div class={className} bind:this={containerElement} />
{:else if type === "header"}
<header class={className} bind:this={containerElement} />
{:else if type === "main"}
<main class={className} bind:this={containerElement} />
{:else if type === "footer"}
<footer class={className} bind:this={containerElement} />
{:else if type === "aside"}
<aside class={className} bind:this={containerElement} />
{:else if type === "summary"}
<summary class={className} bind:this={containerElement} />
{:else if type === "details"}
<details class={className} bind:this={containerElement} />
{:else if type === "article"}
<article class={className} bind:this={containerElement} />
{:else if type === "nav"}
<nav class={className} bind:this={containerElement} />
{:else if type === "mark"}
<mark class={className} bind:this={containerElement} />
{:else if type === "figure"}
<figure class={className} bind:this={containerElement} />
{:else if type === "figcaption"}
<figcaption class={className} bind:this={containerElement} />
{:else if type === "paragraph"}
<p class={className} bind:this={containerElement} />
{/if}
