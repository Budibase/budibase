<script>
  import { getContext } from "svelte"

  const component = getContext("component")
  const { styleable } = getContext("sdk")
  const context = getContext("context")

  const cols = 12
  const rowHeight = 24

  let width
  let height

  $: mobile = $context.device.mobile
  $: empty = $component.empty
  $: rows = Math.max(1, Math.floor(height / rowHeight))
  $: colSize = width / cols
  $: rowSize = height / rows
</script>

<div
  class="grid"
  class:mobile
  bind:clientWidth={width}
  bind:clientHeight={height}
  use:styleable={{
    ...$component.styles,
    normal: {
      ...$component.styles?.normal,
      "--cols": cols,
      "--rows": rows,
      "--col-size": colSize,
      "--row-size": rowSize,
    },
    empty: false,
  }}
  data-rows={rows}
  data-cols={cols}
>
  <div class="underlay">
    {#each { length: cols * rows } as _}
      <div class="placeholder" />
    {/each}
  </div>

  <!-- Only render the slot if not empty, as we don't want the placeholder -->
  {#if !empty}
    <slot />
  {/if}
</div>

<style>
  .grid {
    position: relative;
    height: 400px;
    --spacing: 8;

    /*
      Prevent cross-grid variable inheritance. The other variables for alignment
      are always set on each component, so we don't need to worry about
      inheritance.
    */
    --grid-desktop-col-start: initial;
    --grid-desktop-col-end: initial;
    --grid-desktop-row-start: initial;
    --grid-desktop-row-end: initial;
    --grid-mobile-col-start: initial;
    --grid-mobile-col-end: initial;
    --grid-mobile-row-start: initial;
    --grid-mobile-row-end: initial;
  }

  .grid,
  .underlay {
    display: grid;
    grid-template-rows: repeat(var(--rows), 1fr);
    grid-template-columns: repeat(var(--cols), 1fr);
    gap: 0;
  }
  .underlay {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-top: 1px solid var(--spectrum-global-color-gray-900);
    border-left: 1px solid var(--spectrum-global-color-gray-900);
    opacity: 0.1;
    pointer-events: none;
  }
  .underlay {
    z-index: 0;
  }
  .placeholder {
    border-bottom: 1px solid var(--spectrum-global-color-gray-900);
    border-right: 1px solid var(--spectrum-global-color-gray-900);
  }

  /* Highlight grid lines when resizing children */
  :global(.grid.highlight > .underlay) {
    display: grid;
  }

  /* Highlight sibling borders when resizing childern */
  :global(.grid.highlight > .component:not(.dragging)) {
    outline: 1px solid var(--spectrum-global-color-static-blue-200);
  }

  /* Ensure all top level children have grid styles applied */
  .grid :global(> .component) {
    display: flex;
    overflow: auto;
    pointer-events: all;
    position: relative;
    padding: 4px;
    margin: 4px;

    /* On desktop, use desktop metadata and fall back to mobile */
    /* Position vars */
    --col-start: var(--grid-desktop-col-start, var(--grid-mobile-col-start, 1));
    --col-end: var(
      --grid-desktop-col-end,
      var(
        --grid-mobile-col-end,
        round(
          up,
          calc(
            (var(--spacing) * 2 + var(--default-width)) / var(--col-size) + 1
          )
        )
      )
    );
    --row-start: var(--grid-desktop-row-start, var(--grid-mobile-row-start, 1));
    --row-end: var(
      --grid-desktop-row-end,
      var(
        --grid-mobile-row-end,
        round(
          up,
          calc(
            (var(--spacing) * 2 + var(--default-height)) / var(--row-size) + 1
          )
        )
      )
    );

    /* Flex vars */
    --h-align: var(--grid-desktop-h-align, var(--grid-mobile-h-align));
    --v-align: var(--grid-desktop-v-align, var(--grid-mobile-v-align));

    /* Ensure grid metadata falls within limits */
    grid-column-start: min(max(1, var(--col-start)), var(--cols)) !important;
    grid-column-end: min(
      max(2, var(--col-end)),
      calc(var(--cols) + 1)
    ) !important;
    grid-row-start: min(max(1, var(--row-start)), var(--rows)) !important;
    grid-row-end: min(max(2, var(--row-end)), calc(var(--rows) + 1)) !important;

    /* Flex container styles */
    flex-direction: column;
    align-items: var(--h-align);
    justify-content: var(--v-align);
  }

  /* On mobile, use mobile metadata and fall back to desktop */
  .grid.mobile :global(> .component) {
    /* Position vars */
    --col-start: var(--grid-mobile-col-start, var(--grid-desktop-col-start, 1));
    --col-end: var(
      --grid-mobile-col-end,
      var(
        --grid-desktop-col-end,
        round(
          up,
          calc(
            (var(--spacing) * 2 + var(--default-width)) / var(--col-size) + 1
          )
        )
      )
    );
    --row-start: var(--grid-mobile-row-start, var(--grid-desktop-row-start, 1));
    --row-end: var(
      --grid-mobile-row-end,
      var(
        --grid-desktop-row-end,
        round(
          up,
          calc(
            (var(--spacing) * 2 + var(--default-height)) / var(--row-size) + 1
          )
        )
      )
    );

    /* Flex vars */
    --h-align: var(--grid-mobile-h-align, var(--grid-desktop-h-align));
    --v-align: var(--grid-mobile-v-align, var(--grid-desktop-v-align));
  }

  /* Handle grid children which need to fill the outer component wrapper */
  .grid :global(> .component > *) {
    flex: 0 0 auto !important;
  }
  .grid:not(.mobile) :global(> .component.grid-desktop-grow > *) {
    flex: 1 1 0 !important;
    height: 0 !important;
  }
  .grid.mobile :global(> .component.grid-mobile-grow > *) {
    flex: 1 1 0 !important;
    height: 0 !important;
  }
</style>
