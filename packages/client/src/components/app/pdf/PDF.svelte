<script lang="ts">
  import { getContext, onMount } from "svelte"
  import { Heading, Button } from "@budibase/bbui"
  import { htmlToPdf, Orientations } from "./pdf"

  const component = getContext("component")
  const { styleable, Block, BlockComponent } = getContext("sdk")

  export let fileName: string | undefined
  export let buttonText: string | undefined

  const landscape = false
  const margin = 60
  const PageHeightPt = 841.89
  const InnerPageHeightPt = 721.48
  const InnerPageHeightPx = 963.97
  const PxToPtFactor = InnerPageHeightPx / InnerPageHeightPt

  let rendering = false
  let pageCount = 1
  let innerRef: HTMLElement

  $: safeName = fileName || "Report"
  $: safeButtonText = buttonText || "Download PDF"
  $: safeCount = Math.max(pageCount || 1, pageCount)
  $: pageRefs = new Array(safeCount)
  $: height = PageHeightPt + (pageCount - 1) * InnerPageHeightPt

  const generatePDF = async () => {
    rendering = true
    try {
      const pages = pageRefs.map(ref => ref.outerHTML)
      await htmlToPdf(pages, {
        fileName: safeName,
        margin,
        orientation: landscape ? Orientations.LANDSCAPE : Orientations.PORTRAIT,
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

  const pxToPt = (px: number) => {
    return px / PxToPtFactor
  }

  onMount(() => {
    const observer = new ResizeObserver(() => {
      const heightPt = pxToPt(innerRef.getBoundingClientRect().height)
      pageCount = Math.max(1, Math.ceil(heightPt / InnerPageHeightPt))
    })
    observer.observe(innerRef)

    return () => {
      observer.disconnect()
    }
  })
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
      <div class="page" style="min-height:{height}pt;">
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
            styles={{
              normal: {
                height: "721.48pt",
              },
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
