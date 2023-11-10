<script>
  import { getContext } from "svelte"
  import { Button, Heading } from "@budibase/bbui"
  import { htmlToPdf, Orientations } from "./pdf"

  const component = getContext("component")
  const { styleable } = getContext("sdk")

  export let fileName
  export let pageCount = 1
  export let footer = false
  export let margin = 60
  export let landscape = false

  let rendering = false
  let progress = 1

  $: safeName = fileName || "Report"
  $: safeCount = Math.max(pageCount || 1, pageCount)
  $: pageRefs = new Array(safeCount)

  const generatePDF = async () => {
    rendering = true
    try {
      const pages = pageRefs.map(ref => ref.outerHTML)
      await htmlToPdf(pages, {
        fileName: safeName,
        margin,
        orientation: landscape ? Orientations.LANDSCAPE : Orientations.PORTRAIT,
        progressCallback: page => {
          progress = page
        },
      })
    } catch (error) {
      console.error("Error rendering PDF:")
      console.error(error)
    }
    rendering = false
  }
</script>

<div class="container" class:landscape use:styleable={$component.styles}>
  <div class="title">
    <Heading size="M">{safeName}</Heading>
    <Button disabled={rendering} cta on:click={generatePDF}>
      {#if rendering}
        Rendering page {progress} of {safeCount}
      {:else}
        Download PDF
      {/if}
    </Button>
  </div>
  {#each pageRefs as ref, pageNumber}
    <div class="page">
      <div
        dir="ltr"
        class="spectrum spectrum--lightest spectrum--medium pageContent"
        bind:this={ref}
      >
        <slot />
      </div>
      {#if footer}
        <div class="footer" style="--margin: {margin}pt;">
          <div>{safeName}</div>
          <div>Page {pageNumber + 1} of {pageCount}</div>
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    width: 595.28pt;
    gap: var(--spacing-xl);
    align-self: center;
  }
  .container.landscape {
    width: 841.89pt;
  }
  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .page {
    width: 595.28pt;
    height: 841.89pt;
    padding: 60pt;
    background-color: white;
    flex: 0 0 auto;
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.1);
    flex-direction: column;
    margin: 0 auto;
    position: relative;
  }
  .container.landscape .page {
    width: 841.89pt;
    height: 595.28pt;
  }
  .pageContent {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    padding: 1px;
  }
  .footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    left: var(--margin);
    bottom: 30pt;
    width: calc(100% - var(--margin) * 2);
    color: #aaa;
  }
</style>
