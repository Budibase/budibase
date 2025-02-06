<script>
  import { onMount, getContext } from "svelte"
  import { Icon, Input, ProgressCircle } from "@budibase/bbui"
  import { debounce } from "../../../utils/utils"
  import GridPopover from "../overlays/GridPopover.svelte"
  import { OptionColours } from "../../../constants"

  const { API, cache } = getContext("grid")

  export let value = []
  export let api
  export let readonly
  export let focused
  export let schema
  export let onChange
  export let contentLines = 1
  export let searchFunction = API.searchTable
  export let primaryDisplay
  export let hideCounter = false

  const color = OptionColours[0]

  let isOpen = false
  let searchResults
  let searchString
  let lastSearchString
  let candidateIndex
  let lastSearchId
  let searching = false
  let anchor

  $: fieldValue = parseValue(value)
  $: oneRowOnly = schema?.relationshipType === "one-to-many"
  $: editable = focused && !readonly
  $: lookupMap = buildLookupMap(fieldValue, isOpen)
  $: debouncedSearch(searchString)
  $: {
    if (!focused && isOpen) {
      close()
    }
  }

  $: relationFields = fieldValue?.reduce((acc, f) => {
    const fields = {}
    for (const [column] of Object.entries(schema?.columns || {}).filter(
      ([key, column]) =>
        column.visible !== false && f[key] !== null && f[key] !== undefined
    )) {
      fields[column] = f[column]
    }
    if (Object.keys(fields).length) {
      acc[f._id] = fields
    }
    return acc
  }, {})

  const parseValue = value => {
    if (Array.isArray(value) && value.every(x => x?._id)) {
      return value
    }
    return []
  }

  // Builds a lookup map to quickly check which rows are selected
  const buildLookupMap = (value, isOpen) => {
    let map = {}
    if (!isOpen || !value?.length) {
      return map
    }
    for (let i = 0; i < value.length; i++) {
      map[value[i]._id] = true
    }
    return map
  }

  // Checks if a certain row is currently selected
  const isRowSelected = row => {
    if (!row?._id) {
      return false
    }
    return lookupMap?.[row._id] === true
  }

  // Search for rows based on the search string
  const search = async (searchString, force = false) => {
    // Avoid update state at all if we've already handled the update and this is
    // a wasted search due to svelte reactivity
    if (!force && !searchString && !lastSearchString) {
      return
    }

    // Reset state if this search is invalid
    if (!schema?.tableId || !isOpen) {
      lastSearchString = null
      candidateIndex = null
      searchResults = []
      return
    }

    // Search for results, using IDs to track invocations and ensure we're
    // handling the latest update
    lastSearchId = Math.random()
    searching = true
    const thisSearchId = lastSearchId
    const results = await searchFunction(schema.tableId, {
      paginate: false,
      limit: 20,
      query: {
        string: {
          [`1:${primaryDisplay}`]: searchString || "",
        },
      },
    })
    searching = false

    // In case searching takes longer than our debounced update, abandon these
    // results
    if (thisSearchId !== lastSearchId) {
      return
    }

    // Sort and process results
    searchResults = sortRows(
      results.rows?.map(row => ({
        ...row,
        primaryDisplay: row[primaryDisplay],
      }))
    )
    candidateIndex = searchResults?.length ? 0 : null
    lastSearchString = searchString
  }

  // Debounced version of searching
  const debouncedSearch = debounce(search, 250)

  // Alphabetically sorts rows by their primary display column
  const sortRows = rows => {
    if (!rows?.length) {
      return []
    }
    return rows.slice().sort((a, b) => {
      return a.primaryDisplay < b.primaryDisplay ? -1 : 1
    })
  }

  const open = async () => {
    isOpen = true

    // Find the primary display for the related table
    if (!primaryDisplay) {
      searching = true
      primaryDisplay = await cache.actions.getPrimaryDisplayForTableId(
        schema.tableId
      )
    }

    // Show initial list of results
    await search(null, true)
  }

  const close = () => {
    isOpen = false
    searchResults = []
    searchString = null
    lastSearchString = null
    candidateIndex = null
  }

  const onKeyDown = e => {
    if (!isOpen) {
      return false
    }
    if (e.key === "ArrowDown") {
      // Select next result on down arrow
      e.preventDefault()
      if (candidateIndex == null) {
        candidateIndex = 0
      } else {
        candidateIndex = Math.min(searchResults.length - 1, candidateIndex + 1)
      }
    } else if (e.key === "ArrowUp") {
      // Select previous result on up array
      e.preventDefault()
      if (candidateIndex === 0) {
        candidateIndex = null
      } else if (candidateIndex != null) {
        candidateIndex = Math.max(0, candidateIndex - 1)
      }
    } else if (e.key === "Enter") {
      // Toggle the highlighted result on enter press
      if (candidateIndex != null && searchResults[candidateIndex] != null) {
        toggleRow(searchResults[candidateIndex])
      }
    }
    return true
  }

  // Toggles whether a row is included in the relationship or not
  const toggleRow = async row => {
    if (fieldValue?.some(x => x._id === row._id)) {
      // If the row is already included, remove it and update the candidate
      // row to be the same position if possible
      if (oneRowOnly) {
        await onChange([])
      } else {
        const newValue = fieldValue.filter(x => x._id !== row._id)
        if (!newValue.length) {
          candidateIndex = null
        } else {
          candidateIndex = Math.min(candidateIndex, newValue.length - 1)
        }
        await onChange(newValue)
      }
    } else {
      // If we don't have this row, include it
      if (oneRowOnly) {
        await onChange([row])
      } else {
        await onChange(sortRows([...(fieldValue || []), row]))
      }
      candidateIndex = null
    }
    close()
  }

  const readable = value => {
    if (value == null) {
      return ""
    }
    if (value instanceof Object) {
      return JSON.stringify(value)
    }
    return value
  }

  onMount(() => {
    api = {
      focus: open,
      blur: close,
      isActive: () => isOpen,
      onKeyDown,
    }
  })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="wrapper"
  class:editable
  class:focused
  style="--color:{color};"
  bind:this={anchor}
>
  <div class="container">
    <div
      class="values"
      class:wrap={editable || contentLines > 1}
      class:disabled={!focused}
      on:wheel={e => (focused ? e.stopPropagation() : null)}
    >
      {#each fieldValue || [] as relationship}
        {#if relationship[primaryDisplay] || relationship.primaryDisplay}
          <div
            class="badge"
            class:extra-info={!!relationFields[relationship._id]}
            on:focus={() => {}}
          >
            <span>
              {readable(
                relationship[primaryDisplay] || relationship.primaryDisplay
              )}
            </span>
            {#if editable}
              <Icon
                name="Close"
                size="XS"
                hoverable
                on:click={() => toggleRow(relationship)}
              />
            {/if}
          </div>
        {/if}
      {/each}
      {#if editable}
        <div class="add" on:click={open}>
          <Icon name="Add" size="S" />
        </div>
      {/if}
    </div>
    {#if !hideCounter && fieldValue?.length}
      <div class="count">
        {fieldValue?.length || 0}
      </div>
    {/if}
  </div>
</div>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if isOpen}
  <GridPopover open={isOpen} {anchor} on:close={close}>
    <div class="dropdown" on:wheel|stopPropagation>
      <div class="search">
        <Input
          autofocus
          quiet
          type="text"
          bind:value={searchString}
          placeholder={primaryDisplay ? `Search by ${primaryDisplay}` : null}
        />
      </div>
      {#if searching}
        <div class="searching">
          <ProgressCircle size="S" />
        </div>
      {:else if searchResults?.length}
        <div class="results">
          {#each searchResults as row, idx}
            <div
              class="result"
              on:click={() => toggleRow(row)}
              class:candidate={idx === candidateIndex}
              on:mouseenter={() => (candidateIndex = idx)}
            >
              <div class="badge">
                <span>
                  {readable(row.primaryDisplay)}
                </span>
              </div>
              {#if isRowSelected(row)}
                <Icon size="S" name="Checkmark" color="var(--accent-color)" />
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </GridPopover>
{/if}

<style>
  .wrapper {
    flex: 1 1 auto;
    align-self: flex-start;
    min-height: var(--row-height);
    max-height: var(--row-height);
    overflow: hidden;
  }
  .wrapper.focused {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: var(--cell-background);
    z-index: 1;
    max-height: none;
    overflow: visible;
  }

  .container {
    min-height: var(--row-height);
    overflow: hidden;
    display: flex;
    align-items: flex-start;
  }
  .focused .container {
    overflow-y: auto;
    border-radius: 2px;
  }
  .focused .container:after {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border: 2px solid var(--cell-color);
    pointer-events: none;
    border-radius: 2px;
    box-sizing: border-box;
  }

  .values {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    flex: 1 1 auto;
    grid-column-gap: var(--cell-spacing);
    grid-row-gap: var(--cell-padding);
    overflow: hidden;
    padding: var(--cell-padding);
    flex-wrap: nowrap;
  }
  .values.disabled {
    pointer-events: none;
  }
  .values.wrap {
    flex-wrap: wrap;
  }
  .count {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    color: var(--spectrum-global-color-gray-500);
    padding: var(--cell-padding) var(--cell-padding) var(--cell-padding) 20px;
    background: linear-gradient(
      to right,
      transparent 0%,
      var(--cell-background) 40%
    );
  }
  .wrapper:hover:not(.focused) .count {
    display: block;
  }
  .badge {
    flex: 0 0 auto;
    padding: 0 var(--cell-padding);
    background: var(--color);
    border-radius: var(--cell-padding);
    user-select: none;
    display: flex;
    align-items: center;
    gap: var(--cell-spacing);
    height: 20px;
    max-width: 100%;
  }
  .values.wrap .badge.extra-info:hover {
    filter: brightness(1.25);
    cursor: pointer;
  }

  .badge span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .add {
    background: var(--spectrum-global-color-gray-200);
    padding: 4px;
    border-radius: 4px;
  }
  .add :global(.spectrum-Icon) {
    width: 12px;
    height: 12px;
  }
  .add:hover {
    background: var(--spectrum-global-color-gray-300);
    cursor: pointer;
  }

  .dropdown {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .searching {
    padding: var(--cell-padding);
    display: flex;
    justify-content: center;
  }
  .results {
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  .result {
    padding: 0 var(--cell-padding);
    flex: 0 0 var(--default-row-height);
    display: flex;
    gap: var(--cell-spacing);
    justify-content: space-between;
    align-items: center;
  }
  .result.candidate {
    background-color: var(--spectrum-global-color-gray-200);
    cursor: pointer;
  }
  .result .badge {
    flex: 1 1 auto;
    overflow: hidden;
  }

  .search {
    flex: 0 0 calc(var(--default-row-height) - 1px);
    display: flex;
    align-items: center;
    margin: 4px var(--cell-padding);
  }
  .search :global(.spectrum-Textfield) {
    min-width: 0;
    width: 100%;
  }
  .search :global(.spectrum-Textfield-input) {
    font-size: 13px;
  }
  .search :global(.spectrum-Form-item) {
    flex: 1 1 auto;
  }
</style>
