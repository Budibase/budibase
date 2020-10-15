<script>
  import { goto, params } from "@sveltech/routify"
  import { onMount } from "svelte"
  import { fade } from "svelte/transition"
  import fsort from "fast-sort"
  import getOr from "lodash/fp/getOr"
  import { store, backendUiStore } from "builderStore"
  import api from "builderStore/api"
  import { Button, Icon } from "@budibase/bbui"
  import ActionButton from "components/common/ActionButton.svelte"
  import AttachmentList from "./AttachmentList.svelte"
  import TablePagination from "./TablePagination.svelte"
  import CreateEditRowModal from "./modals/CreateEditRowModal.svelte"
  import RowPopover from "./buttons/CreateRowButton.svelte"
  import ColumnPopover from "./buttons/CreateColumnButton.svelte"
  import ViewPopover from "./buttons/CreateViewButton.svelte"
  import ColumnHeaderPopover from "./popovers/ColumnPopover.svelte"
  import EditRowPopover from "./popovers/RowPopover.svelte"
  import CalculationPopover from "./buttons/CalculateButton.svelte"
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
      `/${$params.application}/backend/table/${tableId}/relationship/${row._id}/${fieldName}`
    )
  }
</script>

<section>
  <div class="table-controls">
    <h2 class="title">
      <span>{title}</span>
      {#if loading}
        <div transition:fade>
          <Spinner size="10" />
        </div>
      {/if}
    </h2>
    <div class="popovers">
      <slot />
    </div>
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
</section>

<style>
  .title {
    font-size: 24px;
    font-weight: 600;
    text-rendering: optimizeLegibility;
    margin-top: 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .title > span {
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
    margin-bottom: var(--spacing-xl);
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
