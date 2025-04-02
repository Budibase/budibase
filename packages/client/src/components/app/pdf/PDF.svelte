<script lang="ts">
  import { getContext, onMount, tick } from "svelte"
  import { Heading, Button } from "@budibase/bbui"
  import { htmlToPdf, pxToPt, A4HeightPx, type PDFOptions } from "./pdf"
  import { GridRowHeight } from "@/constants"
  import CustomThemeWrapper from "@/components/CustomThemeWrapper.svelte"

  const component = getContext("component")
  const { styleable, Block, BlockComponent } = getContext("sdk")

  export let fileName: string | undefined
  export let buttonText: string | undefined

  // Derive dimension calculations
  const DesiredRows = 40
  const innerPageHeightPx = GridRowHeight * DesiredRows
  const doubleMarginPx = A4HeightPx - innerPageHeightPx
  const marginPt = pxToPt(doubleMarginPx / 2)

  let rendering = false
  let pageCount = 1
  let ref: HTMLElement
  let gridRef: HTMLElement

  $: safeName = fileName || "Report"
  $: safeButtonText = buttonText || "Download PDF"
  $: heightPx = pageCount * innerPageHeightPx + doubleMarginPx
  $: pageStyle = `--height:${heightPx}px; --margin:${marginPt}pt;`
  $: gridMinHeight = pageCount * DesiredRows * GridRowHeight

  const generatePDF = async () => {
    rendering = true
    await tick()
    preprocessCSS()
    try {
      const opts: PDFOptions = {
        fileName: safeName,
        marginPt,
        footer: true,
      }
      await htmlToPdf(ref, opts)
    } catch (error) {
      console.error("Error rendering PDF", error)
    }
    rendering = false
  }

  const preprocessCSS = () => {
    const els = document.getElementsByClassName("grid-child")
    for (let el of els) {
      if (!(el instanceof HTMLElement)) {
        return
      }
      // Get the computed values and assign them back to the style, simplifying
      // the CSS that gets handled by HTML2PDF
      const styles = window.getComputedStyle(el)
      el.style.setProperty("grid-column-end", styles.gridColumnEnd, "important")
    }
  }

  const getDividerStyle = (idx: number) => {
    const top = (idx + 1) * innerPageHeightPx + doubleMarginPx / 2
    return `--idx:"${idx + 1}"; --top:${top}px;`
  }

  const handleGridMutation = () => {
    const rows = parseInt(gridRef.dataset.requiredRows || "1")
    const nextPageCount = Math.max(1, Math.ceil(rows / DesiredRows))
    if (nextPageCount > pageCount || !gridRef.classList.contains("highlight")) {
      pageCount = nextPageCount
    }
  }

  onMount(() => {
    // Observe required content rows and use this to determine required pages
    const gridDOMID = `${$component.id}-grid-dom`
    gridRef = document.getElementsByClassName(gridDOMID)[0] as HTMLElement
    const mutationObserver = new MutationObserver(handleGridMutation)
    mutationObserver.observe(gridRef, {
      attributes: true,
      attributeFilter: ["data-required-rows", "class"],
    })
    return () => {
      mutationObserver.disconnect()
    }
  })
</script>

<Block>
  <div class="wrapper" style="--margin:{marginPt}pt;">
    <div class="container" use:styleable={$component.styles}>
      <div class="title">
        <Heading size="M">{safeName}</Heading>
        <Button disabled={rendering} cta on:click={generatePDF}>
          {safeButtonText}
        </Button>
      </div>
      <div class="page" style={pageStyle}>
        {#if pageCount > 1}
          {#each { length: pageCount } as _, idx}
            <div
              class="divider"
              class:last={idx === pageCount - 1}
              style={getDividerStyle(idx)}
            />
          {/each}
        {/if}
        <div
          class="spectrum spectrum--medium spectrum--light pageContent"
          bind:this={ref}
        >
          <CustomThemeWrapper popoverRoot={false}>
            <BlockComponent
              type="container"
              props={{ layout: "grid" }}
              styles={{
                normal: {
                  height: `${gridMinHeight}px`,
                },
              }}
              context="grid"
            >
              <slot />
            </BlockComponent>
          </CustomThemeWrapper>
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
    background: white;
  }
  .divider {
    width: 100%;
    height: 2px;
    background: var(--spectrum-global-color-static-gray-400);
    position: absolute;
    left: 0;
    top: var(--top);
    transform: translateY(-50%);
  }
  .divider.last {
    top: calc(var(--top) + var(--margin));
    background: transparent;
  }
</style>
