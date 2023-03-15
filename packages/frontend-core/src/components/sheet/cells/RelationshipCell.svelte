<script>
  import { getColor } from "../utils"
  import { onMount, getContext } from "svelte"
  import { Icon, Input } from "@budibase/bbui"
  import { debounce } from "../../../utils/utils"

  export let value
  export let api
  export let readonly
  export let selected
  export let schema
  export let onChange

  const { API } = getContext("sheet")

  let isOpen = false
  let searchResults
  let searchString
  let definition
  let primaryDisplay
  let candidateIndex
  let lastSearchId

  $: editable = selected && !readonly
  $: results = getResults(searchResults, value)
  $: lookupMap = buildLookupMap(value, isOpen)
  $: {
    if (!selected) {
      close()
    }
  }

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

  const isRowSelected = row => {
    if (!row?._id) {
      return false
    }
    return lookupMap?.[row._id] === true
  }

  const search = debounce(async value => {
    if (!value || !schema?.tableId || !isOpen) {
      searchString = value
      candidateIndex = null
      searchResults = []
      return
    }

    lastSearchId = Math.random()
    const thisSearchId = lastSearchId
    const results = await API.searchTable({
      paginate: false,
      tableId: schema.tableId,
      limit: 20,
      query: {
        string: {
          [`1:${primaryDisplay}`]: value,
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
    searchString = value
  }, 250)

  const sortRows = rows => {
    if (!rows?.length) {
      return []
    }
    return rows.slice().sort((a, b) => {
      return a.primaryDisplay < b.primaryDisplay ? -1 : 1
    })
  }

  const getResults = (searchResults, value) => {
    return searchString ? sortRows(searchResults) : sortRows(value)
  }

  const open = async () => {
    isOpen = true

    // Fetch definition if required
    if (!definition) {
      definition = await API.fetchTableDefinition(schema.tableId)
      primaryDisplay =
        definition?.primaryDisplay || definition?.schema?.[0]?.name
    }
  }

  const close = () => {
    isOpen = false
    searchString = null
    searchResults = []
    candidateIndex = null
  }

  const onKeyDown = e => {
    if (!isOpen) {
      return false
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (candidateIndex == null) {
        candidateIndex = 0
      } else {
        candidateIndex = Math.min(results.length - 1, candidateIndex + 1)
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (candidateIndex === 0) {
        candidateIndex = null
      } else if (candidateIndex != null) {
        candidateIndex = Math.max(0, candidateIndex - 1)
      }
    } else if (e.key === "Enter") {
      if (candidateIndex != null && results[candidateIndex] != null) {
        toggleRow(results[candidateIndex])
      }
    }
    return true
  }

  const toggleRow = row => {
    if (value?.some(x => x._id === row._id)) {
      const newValue = value.filter(x => x._id !== row._id)
      if (!newValue.length) {
        candidateIndex = null
      } else {
        candidateIndex = Math.min(candidateIndex, newValue.length - 1)
      }
      onChange(newValue)
    } else {
      lookupMap[row._id] = true
      onChange(sortRows([...(value || []), row]))
      candidateIndex = null
    }
    searchString = null
    searchResults = []
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
  <div class="dropdown" on:wheel|stopPropagation>
    <div class="search">
      <Input
        autofocus
        quiet
        type="text"
        value={searchString}
        on:change={e => search(e.detail)}
      />
    </div>
    {#if !searchString}
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
  .result .badge {
    max-width: 340px;
  }
  .dropdown {
    position: absolute;
    top: -1px;
    left: -1px;
    min-width: calc(100% + 2px);
    max-width: calc(100% + 240px);
    max-height: calc(var(--cell-height) + 240px);
    background: var(--cell-background);
    border: var(--cell-border);
    box-shadow: 0 0 8px 4px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    align-items: stretch;
    background-color: var(--cell-background-hover);
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
