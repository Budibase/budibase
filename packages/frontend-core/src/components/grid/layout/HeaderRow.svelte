<script>
  import NewColumnButton from "./NewColumnButton.svelte"
  import { getContext } from "svelte"
  import GridScrollWrapper from "./GridScrollWrapper.svelte"
  import HeaderCell from "../cells/HeaderCell.svelte"
  import { TempTooltip, TooltipType } from "@budibase/bbui"

  const { renderedColumns, config, hasNonAutoColumn, datasource, loading } =
    getContext("grid")
</script>

<div class="header">
  <GridScrollWrapper scrollHorizontally>
    <div class="row">
      {#each $renderedColumns as column, idx}
        <HeaderCell {column} {idx}>
          <slot name="edit-column" />
        </HeaderCell>
      {/each}
    </div>
  </GridScrollWrapper>
  {#if $config.canEditColumns}
    {#key $datasource}
      <TempTooltip
        text="Click here to create your first column"
        type={TooltipType.Info}
        condition={!$hasNonAutoColumn && !$loading}
      >
        <NewColumnButton>
          <slot name="add-column" />
        </NewColumnButton>
      </TempTooltip>
    {/key}
  {/if}
</div>

<style>
  .header {
    background: var(--grid-background-alt);
    border-bottom: var(--cell-border);
    position: relative;
    height: var(--default-row-height);
  }
  .row {
    display: flex;
  }
</style>
