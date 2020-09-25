<script>
  import { onMount } from "svelte"
  import fsort from "fast-sort"
  import getOr from "lodash/fp/getOr"
  import { store, backendUiStore } from "builderStore"
  import { Button, Icon } from "@budibase/bbui"
  import ActionButton from "components/common/ActionButton.svelte"
  import LinkedRecord from "./LinkedRecord.svelte"
  import AttachmentList from "./AttachmentList.svelte"
  import TablePagination from "./TablePagination.svelte"
  import { CreateEditRecordModal } from "./modals"
  import RowPopover from "./popovers/Row.svelte"
  import ColumnPopover from "./popovers/Column.svelte"
  import ViewPopover from "./popovers/View.svelte"
  import ColumnHeaderPopover from "./popovers/ColumnHeader.svelte"
  import EditRowPopover from "./popovers/EditRow.svelte"
  import * as api from "./api"

  const ITEMS_PER_PAGE = 10
  // Internal headers we want to hide from the user
  const INTERNAL_HEADERS = ["_id", "_rev", "modelId", "type"]

  let modalOpen = false
  let data = []
  let headers = []
  let currentPage = 0
  let search

  $: {
    if (
      $backendUiStore.selectedView &&
      $backendUiStore.selectedView.name.startsWith("all_")
    ) {
      api.fetchDataForView($backendUiStore.selectedView).then(records => {
        data = records || []
      })
    }
  }

  $: sort = $backendUiStore.sort
  $: sorted = sort ? fsort(data)[sort.direction](sort.column) : data
  $: paginatedData = sorted
    ? sorted.slice(
        currentPage * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
      )
    : []

  $: headers = Object.keys($backendUiStore.selectedModel.schema)
    .sort()
    .filter(id => !INTERNAL_HEADERS.includes(id))

  $: schema = $backendUiStore.selectedModel.schema
</script>

<section>
  <h2 class="title">{$backendUiStore.selectedModel.name}</h2>
  <div class="popovers">
    <ColumnPopover />
    {#if Object.keys($backendUiStore.selectedModel.schema).length > 0}
      <RowPopover />
      <ViewPopover />
    {/if}
  </div>
  <table class="bb-table">
    <thead>
      <tr>
        <th class="edit-header">
          <div>Edit</div>
        </th>
        {#each headers as header}
          <th>
            <ColumnHeaderPopover
              field={$backendUiStore.selectedModel.schema[header]} />
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#if paginatedData.length === 0}
        <td class="no-border">No data.</td>
        {#each headers as header}
          <td class="no-border" />
        {/each}
      {/if}
      {#each paginatedData as row}
        <tr>
          <td>
            <EditRowPopover {row} />
          </td>
          {#each headers as header}
            <td>
              {#if schema[header].type === 'link'}
                <LinkedRecord field={schema[header]} ids={row[header]} />
              {:else if schema[header].type === 'attachment'}
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

  .popovers {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  table {
    border: 1px solid var(--grey-4);
    background: #fff;
    border-collapse: collapse;
  }

  thead {
    background: var(--grey-3);
    border-bottom: 1px solid var(--grey-4);
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

  .edit-header {
    width: 100px;
    cursor: default;
  }
  .edit-header:hover {
    color: var(--ink);
  }

  th:hover {
    color: var(--blue);
    cursor: pointer;
  }

  td {
    max-width: 200px;
    text-overflow: ellipsis;
    border: 1px solid var(--grey-4);
    overflow: hidden;
    white-space: nowrap;
    box-sizing: border-box;
    padding: var(--spacing-l) var(--spacing-m);
    font-size: var(--font-size-xs);
  }
  td.no-border {
    border: none;
  }

  tbody {
    border: 1px solid var(--grey-4);
  }
  tbody tr {
    border-bottom: 1px solid var(--grey-4);
    transition: 0.3s background-color;
    color: var(--ink);
  }
  tbody tr:hover {
    background: var(--grey-1);
  }
</style>
