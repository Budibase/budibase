<script>
  import { onMount } from "svelte"
  import fsort from "fast-sort"
  import getOr from "lodash/fp/getOr"
  import { store, backendUiStore } from "builderStore"
  import api from "builderStore/api"
  import { Button, Icon } from "@budibase/bbui"
  import ActionButton from "components/common/ActionButton.svelte"
  import AttachmentList from "./AttachmentList.svelte"
  import TablePagination from "./TablePagination.svelte"
  import CreateEditRecordModal from "./popovers/CreateEditRecord.svelte"
  import RowPopover from "./popovers/Row.svelte"
  import ColumnPopover from "./popovers/Column.svelte"
  import ViewPopover from "./popovers/View.svelte"
  import ColumnHeaderPopover from "./popovers/ColumnHeader.svelte"
  import EditRowPopover from "./popovers/EditRow.svelte"
  import CalculationPopover from "./popovers/Calculate.svelte"

  export let schema = []
  export let data = []
  export let title

  const ITEMS_PER_PAGE = 10

  let currentPage = 0

  $: columns = schema ? Object.keys(schema) : []

  $: sort = $backendUiStore.sort
  $: sorted = sort ? fsort(data)[sort.direction](sort.column) : data
  $: paginatedData =
    sorted && sorted.length
      ? sorted.slice(
          currentPage * ITEMS_PER_PAGE,
          currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        )
      : []
</script>

<section>
  <div class="table-controls">
    <h2 class="title">{title}</h2>
    <div class="popovers">
      <slot />
    </div>
  </div>
  <table class="bb-table">
    <thead>
      <tr>
        {#each columns as header}
          <th>{header}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#if paginatedData.length === 0}
        {#each columns as header, idx}
          <td class="no-border">
            {#if idx === 0}No data.{/if}
          </td>
        {/each}
      {/if}
      {#each paginatedData as row}
        <tr>
          {#each columns as header}
            <td>
              {#if schema[header].type === 'attachment'}
                <AttachmentList files={row[header] || []} />
              {:else}{getOr('', header, row)}{/if}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
  <TablePagination
    {data}
    bind:currentPage
    pageItemCount={paginatedData.length}
    {ITEMS_PER_PAGE} />
</section>

<style>
  .title {
    font-size: 24px;
    font-weight: 600;
    text-rendering: optimizeLegibility;
    text-transform: capitalize;
    margin-top: 0;
  }

  table {
    border: 1px solid var(--grey-4);
    background: #fff;
    border-collapse: collapse;
  }

  thead {
    background: var(--grey-3);
    border: 1px solid var(--grey-4);
  }
  thead th {
    color: var(--ink);
    text-transform: capitalize;
    font-weight: 500;
    font-size: 14px;
    text-rendering: optimizeLegibility;
    transition: 0.5s all;
    vertical-align: middle;
    height: 48px;
    padding-top: 0;
    padding-bottom: 0;
  }
  thead th:hover {
    color: var(--blue);
    cursor: pointer;
  }

  td {
    max-width: 200px;
    text-overflow: ellipsis;
    border: 1px solid var(--grey-4);
    white-space: nowrap;
    box-sizing: border-box;
    padding: var(--spacing-l) var(--spacing-m);
    font-size: var(--font-size-xs);
  }
  td.no-border {
    border: none;
  }

  tbody tr {
    border-bottom: 1px solid var(--grey-4);
    transition: 0.3s background-color;
    color: var(--ink);
  }
  tbody tr:hover {
    background: var(--grey-1);
  }

  .table-controls {
    width: 100%;
  }

  .popovers {
    display: flex;
  }

  :global(.popovers > div) {
    margin-right: var(--spacing-m);
  }
</style>
