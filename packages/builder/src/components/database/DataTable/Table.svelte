<script>
  import { onMount } from "svelte"
  import fsort from "fast-sort"
  import getOr from "lodash/fp/getOr"
  import { store, backendUiStore } from "builderStore"
  import api from "builderStore/api"
  import { Button, Icon } from "@budibase/bbui"
  import ActionButton from "components/common/ActionButton.svelte"
  import LinkedRecord from "./LinkedRecord.svelte"
  import TablePagination from "./TablePagination.svelte"
  import { DeleteRecordModal, CreateEditRecordModal } from "./modals"
  import RowPopover from "./popovers/Row.svelte"
  import ColumnPopover from "./popovers/Column.svelte"
  import ViewPopover from "./popovers/View.svelte"
  import ColumnHeaderPopover from "./popovers/ColumnHeader.svelte"
  import EditRowPopover from "./popovers/EditRow.svelte"
  import CalculationPopover from "./popovers/Calculate.svelte"

  export let columns = []
  export let data = []
  export let title

  const ITEMS_PER_PAGE = 10

  let currentPage = 0

  $: paginatedData =
    data && data.length
      ? data.slice(
          currentPage * ITEMS_PER_PAGE,
          currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        )
      : []
  $: sort = $backendUiStore.sort
  $: sorted = sort ? fsort(data)[sort.direction](sort.column) : data
</script>

<section>
  <div class="table-controls">
    <h2 class="title">{title}</h2>
    <div class="popovers">
      <slot />
    </div>
  </div>
  <table class="uk-table">
    <thead>
      <tr>
        {#each columns as header}
          <th>{header.name}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#if paginatedData.length === 0}
        <div class="no-data">No Data.</div>
      {/if}
      {#each paginatedData as row}
        <tr>
          {#each columns as header}
            <td>{getOr(row.default || '', header.key, row)}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
  <TablePagination
    {data}
    bind:currentPage
    pageItemCount={data.length}
    {ITEMS_PER_PAGE} />
</section>

<style>
  section {
    margin-bottom: 20px;
  }
  .title {
    font-size: 24px;
    font-weight: 600;
    text-rendering: optimizeLegibility;
    text-transform: capitalize;
  }

  table {
    border: 1px solid var(--grey-4);
    background: #fff;
    border-radius: 3px;
    border-collapse: collapse;
  }

  thead {
    height: 40px;
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
  }

  th:hover {
    color: var(--blue);
    cursor: pointer;
  }

  td {
    max-width: 200px;
    text-overflow: ellipsis;
    border: 1px solid var(--grey-4);
  }

  tbody tr {
    border-bottom: 1px solid var(--grey-4);
    transition: 0.3s background-color;
    color: var(--ink);
    font-size: 12px;
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

  .no-data {
    padding: 14px;
  }
</style>
