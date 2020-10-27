<script>
  import { goto, params } from "@sveltech/routify"
  import { fade } from "svelte/transition"
  import fsort from "fast-sort"
  import getOr from "lodash/fp/getOr"
  import { backendUiStore } from "builderStore"
  import AttachmentList from "./AttachmentList.svelte"
  import TablePagination from "./TablePagination.svelte"
  import ColumnHeaderPopover from "./popovers/ColumnPopover.svelte"
  import EditRowPopover from "./popovers/RowPopover.svelte"
  import Spinner from "components/common/Spinner.svelte"

  const ITEMS_PER_PAGE = 10

  export let schema = []
  export let data = []
  export let title
  export let allowEditing = false
  export let loading = false

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
  $: tableId = data?.length ? data[0].tableId : null

  function selectRelationship(row, fieldName) {
    if (!row?.[fieldName]?.length) {
      return
    }
    $goto(
      `/${$params.application}/data/table/${tableId}/relationship/${row._id}/${fieldName}`
    )
  }
</script>

<div class="table-container">
  <div class="table-title">
    <h1>{title}</h1>
    {#if loading}
      <div transition:fade>
        <Spinner size="10" />
      </div>
    {/if}
  </div>
  <div class="popovers">
    <slot />
  </div>
  <table class="bb-table">
    <thead>
      <tr>
        {#if allowEditing}
          <th class="edit-header">
            <div>Edit</div>
          </th>
        {/if}
        {#each columns as header}
          <th>
            {#if allowEditing}
              <ColumnHeaderPopover field={schema[header]} />
            {:else}
              <div class="header">{header}</div>
            {/if}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#if paginatedData.length === 0}
        {#if allowEditing}
          <td class="no-border">No data.</td>
        {/if}
        {#each columns as header, idx}
          <td class="no-border">
            {#if idx === 0 && !allowEditing}No data.{/if}
          </td>
        {/each}
      {/if}
      {#each paginatedData as row}
        <tr>
          {#if allowEditing}
            <td>
              <EditRowPopover {row} />
            </td>
          {/if}
          {#each columns as header}
            <td>
              {#if schema[header].type === 'link'}
                <div
                  class:link={row[header] && row[header].length}
                  on:click={() => selectRelationship(row, header)}>
                  {row[header] ? row[header].length : 0}
                  related row(s)
                </div>
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
</div>

<style>
  .table-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-l);
  }

  .table-title {
    height: 24px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .table-title h1 {
    font-size: var(--font-size-m);
    font-weight: 500;
    margin: 0;
  }
  .table-title > div {
    margin-left: var(--spacing-xs);
  }

  .popovers {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-l);
  }
  .popovers :global(button) {
    font-weight: 500;
  }
  .popovers :global(button svg) {
    margin-right: var(--spacing-xs);
  }

  table {
    border: 1px solid var(--grey-4);
    background: #fff;
    border-collapse: collapse;
    margin-top: 0;
  }

  thead {
    background: var(--grey-3);
    border: 1px solid var(--grey-4);
  }

  thead th {
    color: var(--ink);
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

  .header {
    text-transform: capitalize;
  }

  td {
    max-width: 200px;
    text-overflow: ellipsis;
    overflow: hidden;
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

  .edit-header {
    width: 60px;
  }

  .edit-header:hover {
    cursor: default;
    color: var(--ink);
  }

  .link {
    text-decoration: underline;
  }

  .link:hover {
    color: var(--grey-6);
    cursor: pointer;
  }
</style>
