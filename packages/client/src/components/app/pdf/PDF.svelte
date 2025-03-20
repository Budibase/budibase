<script lang="ts">
  import { getContext, onMount } from "svelte"
  import { Heading, Button } from "@budibase/bbui"
  import { htmlToPdf, pxToPt, A4HeightPx } from "./pdf"
  import { GridRowHeight } from "@/constants"

  const component = getContext("component")
  const { styleable, Block, BlockComponent } = getContext("sdk")

  export let fileName: string | undefined
  export let buttonText: string | undefined

  // Config
  const DesiredRows = 40
  const InnerPageHeightPx = GridRowHeight * DesiredRows
  const DoubleMarginPx = A4HeightPx - InnerPageHeightPx
  const MarginPt = pxToPt(DoubleMarginPx / 2)

  let rendering = false
  let pageCount = 1
  let innerRef: HTMLElement

  $: safeName = fileName || "Report"
  $: safeButtonText = buttonText || "Download PDF"
  $: heightPx = pageCount * InnerPageHeightPx + DoubleMarginPx

  const generatePDF = async () => {
    rendering = true
    try {
      await htmlToPdf(innerRef, {
        fileName: safeName,
        margin: MarginPt,
        orientation: "portrait",
        footer: false,
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

  onMount(() => {
    const observer = new ResizeObserver(() => {
      const height = innerRef.getBoundingClientRect().height
      pageCount = Math.max(1, Math.ceil(height / InnerPageHeightPx))
    })
    observer.observe(innerRef)

    return () => {
      observer.disconnect()
    }
  })
</script>

<Block>
  <div class="wrapper">
    <div class="container" use:styleable={$component.styles}>
      <div class="title">
        <Heading size="M">{safeName}</Heading>
        <Button disabled={rendering} cta on:click={generatePDF}>
          {safeButtonText}
        </Button>
      </div>
      <div class="page" style="--height:{heightPx}px; --margin:{MarginPt}pt;">
        {#if pageCount > 1}
          {#each new Array(pageCount - 1) as _, idx}
            <div
              class="divider"
              style="--top:{(idx + 1) * InnerPageHeightPx +
                DoubleMarginPx / 2}px;"
            />
          {/each}
        {/if}
        <div
          dir="ltr"
          class="spectrum spectrum--lightest spectrum--medium pageContent"
          bind:this={innerRef}
        >
          <BlockComponent
            type="container"
            props={{
              layout: "grid",
            }}
          >
            <slot />
          </BlockComponent>
        </div>
      </div>
    </div>
  </div>
</Block>

<style>
  .wrapper {
    width: 100%;
    height: 100%;
    padding: 64px;
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
  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .page {
    width: 595.28pt;
    min-height: var(--height);
    padding: var(--margin);
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
  .pageContent {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
  .divider {
    width: 100%;
    height: 1px;
    background: var(--spectrum-global-color-static-gray-400);
    position: absolute;
    left: 0;
    top: var(--top);
  }
</style>
