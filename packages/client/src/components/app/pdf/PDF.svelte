<script lang="ts">
  import { getContext } from "svelte"
  import { Heading, Button } from "@budibase/bbui"
  import { htmlToPdf, Orientations } from "./pdf"

  const component = getContext("component")
  const { styleable, Block, BlockComponent } = getContext("sdk")

  export let fileName: string | undefined
  export let buttonText: string | undefined

  const landscape = false
  const pageCount = 1
  const footer = true
  const margin = 60

  let rendering = false

  $: safeName = fileName || "Report"
  $: safeButtonText = buttonText || "Download PDF"
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
        footer,
        progressCallback: (page: number) => {
          // eslint-disable-next-line no-console
          console.log("Rendering page", page, "of", pageCount)
        },
      })
    } catch (error) {
      console.error("Error rendering PDF:")
      console.error(error)
    }
    rendering = false
  }
</script>

<Block>
  <div class="wrapper">
    <div class="container" class:landscape use:styleable={$component.styles}>
      <div class="title">
        <Heading size="M">{safeName}</Heading>
        <Button disabled={rendering} cta on:click={generatePDF}>
          {safeButtonText}
        </Button>
      </div>
      {#each pageRefs as ref, pageNumber}
        <div class="page">
          <div
            dir="ltr"
            class="spectrum spectrum--lightest spectrum--medium pageContent"
            bind:this={ref}
          >
            <BlockComponent
              type="container"
              props={{
                layout: "grid",
              }}
              styles={{
                normal: {
                  height: "721.48pt",
                },
              }}
            >
              <slot />
            </BlockComponent>
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
  </div>
</Block>

<style>
  .wrapper {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 40px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
  }
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
