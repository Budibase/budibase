<script>
  import { getColor } from "../lib/utils"
  import { onMount, getContext } from "svelte"
  import { Icon, Input } from "@budibase/bbui"
  import { debounce } from "../../../utils/utils"

  export let value
  export let api
  export let readonly
  export let selected
  export let schema
  export let onChange
  export let invert = false

  const { API } = getContext("sheet")

  let isOpen = false
  let searchResults
  let searchString
  let lastSearchString
  let definition
  let primaryDisplay
  let candidateIndex
  let lastSearchId
  let results

  $: oneRowOnly = schema?.relationshipType === "one-to-many"
  $: editable = selected && !readonly
  $: results = getResults(searchResults, value)
  $: lookupMap = buildLookupMap(value, isOpen)
  $: search(searchString)
  $: {
    if (!selected) {
      close()
    }
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

  // Debounced function to search for rows based on the search string
  const search = debounce(async searchString => {
    // Avoid update state at all if we've already handled the update and this is
    // a wasted search due to svelte reactivity
    if (!searchString && !lastSearchString) {
      return
    }

    // Reset state if this search is invalid
    if (!searchString || !schema?.tableId || !isOpen) {
      lastSearchString = null
      candidateIndex = null
      searchResults = []
      return
    }

    // Search for results, using IDs to track invocations and ensure we're
    // handling the latest update
    lastSearchId = Math.random()
    const thisSearchId = lastSearchId
    const results = await API.searchTable({
      paginate: false,
      tableId: schema.tableId,
      limit: 20,
      query: {
        string: {
          [`1:${primaryDisplay}`]: searchString,
        },
      },
    })

    // In case searching takes longer than our debounced update, abandon these
    // results
    if (thisSearchId !== lastSearchId) {
      return
    }

    // Sort and process results
    searchResults = results.rows?.map(row => ({
      ...row,
      primaryDisplay: row[primaryDisplay],
    }))
    candidateIndex = searchResults?.length ? 0 : null
    lastSearchString = searchString
  }, 250)

  // Alphabetically sorts rows by their primary display column
  const sortRows = rows => {
    if (!rows?.length) {
      return []
    }
    return rows.slice().sort((a, b) => {
      return a.primaryDisplay < b.primaryDisplay ? -1 : 1
    })
  }

  // Generates the list of results to show inside the dropdown
  const getResults = (searchResults, value) => {
    return searchString ? sortRows(searchResults) : sortRows(value)
  }

  const open = async () => {
    isOpen = true

    // Ensure results are properly reset
    results = sortRows(value)

    // Fetch definition if required
    if (!definition) {
      definition = await API.fetchTableDefinition(schema.tableId)
      primaryDisplay =
        definition?.primaryDisplay || definition?.schema?.[0]?.name
    }
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
        candidateIndex = Math.min(results.length - 1, candidateIndex + 1)
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
      if (candidateIndex != null && results[candidateIndex] != null) {
        toggleRow(results[candidateIndex])
      }
    }
    return true
  }

  // Toggles whether a row is included in the relationship or not
  const toggleRow = async row => {
    if (value?.some(x => x._id === row._id)) {
      // If the row is already included, remove it and update the candidate
      // row to be the the same position if possible
      if (oneRowOnly) {
        await onChange([])
      } else {
        const newValue = value.filter(x => x._id !== row._id)
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
        await onChange(sortRows([...(value || []), row]))
      }
      candidateIndex = null
    }

    // Clear search state to allow finding a new row again
    searchString = null
    searchResults = []
    lastSearchString = null
  }

  onMount(() => {
    api = {
      focus: open,
      blur: close,
      onKeyDown,
    }
  })
</script>

<div class="container" on:click={editable ? open : null} class:editable>
  {#each value || [] as relationship, idx}
    {#if relationship.primaryDisplay}
      <div class="badge" style="--color: {getColor(idx)}">
        {relationship.primaryDisplay}
      </div>
    {/if}
  {/each}
</div>

{#if isOpen}
  <div class="dropdown" class:invert on:wheel|stopPropagation>
    <div class="search">
      <Input autofocus quiet type="text" bind:value={searchString} />
    </div>
    {#if !lastSearchString}
      {#if primaryDisplay}
        <div class="info">
          Search for {definition.name} rows by {primaryDisplay}
        </div>
      {/if}
    {:else}
      <div class="info">
        {searchResults.length} row{searchResults.length === 1 ? "" : "s"} found
      </div>
    {/if}
    {#if results?.length}
      <div class="results">
        {#each results as row, idx}
          <div
            class="result"
            on:click={() => toggleRow(row)}
            class:candidate={idx === candidateIndex}
            on:mouseenter={() => (candidateIndex = idx)}
          >
            <div class="badge" style="--color: {getColor(idx)}">
              {row.primaryDisplay}
            </div>
            {#if isRowSelected(row)}
              <Icon
                size="S"
                name="Checkmark"
                color="var(--spectrum-global-color-blue-400)"
              />
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
{/if}

<style>
  .container {
    align-self: stretch;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 var(--cell-padding);
    flex: 1 1 auto;
    width: 0;
    gap: var(--cell-spacing);
    overflow: hidden;
  }
  .container.editable:hover {
    cursor: pointer;
  }

  .badge {
    flex: 0 0 auto;
    padding: 2px var(--cell-padding);
    background: var(--color);
    border-radius: var(--cell-padding);
    user-select: none;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 100%;
    max-width: calc(100% + 240px);
    max-height: var(--max-cell-render-height);
    background: var(--cell-background);
    border: var(--cell-border);
    box-shadow: 0 0 8px 4px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    align-items: stretch;
    background-color: var(--cell-background-hover);
  }
  .dropdown.invert {
    transform: translateY(-100%);
    top: 0;
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
    flex: 0 0 var(--cell-height);
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
    max-width: 340px;
  }

  .search {
    flex: 0 0 calc(var(--cell-height) - 1px);
    display: flex;
    align-items: center;
    margin: 0 var(--cell-padding);
    width: calc(100% - 2 * var(--cell-padding));
  }
  .search :global(.spectrum-Textfield) {
    min-width: 0;
    width: 100%;
  }
  .search :global(.spectrum-Form-item) {
    flex: 1 1 auto;
  }

  .info {
    color: var(--spectrum-global-color-gray-600);
    font-size: 12px;
    padding: var(--cell-padding);
    flex: 0 0 var(--cell-height);
    display: flex;
    align-items: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
