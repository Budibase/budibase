<script context="module">
  import iconData from "./icons.js"

  const icons = Object.keys(iconData).reduce(
    (acc, cat) => [...acc, ...Object.keys(iconData[cat])],
    []
  )
</script>

<script>
  import { Popover, ActionButton, Button, Input } from "@budibase/bbui"
  import { createEventDispatcher, tick } from "svelte"

  const dispatch = createEventDispatcher()

  export let value = ""
  export let maxIconsPerPage = 10

  let searchTerm = ""
  let selectedLetter = "A"
  let currentPage = 1
  let filteredIcons = findIconByTerm(selectedLetter)

  const alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ]

  let buttonAnchor, dropdown
  let loading = false

  function findIconByTerm(term) {
    const r = new RegExp(`^${term}`, "i")
    return icons.filter(i => r.test(i))
  }

  async function switchLetter(letter) {
    currentPage = 1
    searchTerm = ""
    loading = true
    selectedLetter = letter
    filteredIcons = findIconByTerm(letter)
    await tick() //svg icons do not update without tick
    loading = false
  }
  async function findIconOnPage() {
    loading = true
    const iconIdx = filteredIcons.findIndex(i => i.value === value)
    if (iconIdx !== -1) {
      currentPage = Math.ceil(iconIdx / maxIconsPerPage)
    }
    await tick() //svg icons do not update without tick
    loading = false
  }

  async function setSelectedUI() {
    if (value) {
      const letter = displayValue.substring(0, 1)
      await switchLetter(letter)
      await findIconOnPage()
    }
  }

  async function pageClick(next) {
    loading = true
    if (next && currentPage < totalPages) {
      currentPage++
    } else if (!next && currentPage > 1) {
      currentPage--
    }
    await tick() //svg icons do not update without tick
    loading = false
  }

  async function searchForIcon() {
    currentPage = 1
    loading = true
    filteredIcons = findIconByTerm(searchTerm)
    await tick() //svg icons do not update without tick
    loading = false
  }

  const select = icon => {
    value = icon
    dispatch("change", icon)
  }

  $: displayValue = value ? value.substring(3) : "Pick icon"
  $: totalPages = Math.max(1, Math.ceil(filteredIcons.length / maxIconsPerPage))
  $: pageEndIdx = maxIconsPerPage * currentPage
  $: pagedIcons = filteredIcons.slice(pageEndIdx - maxIconsPerPage, pageEndIdx)
  $: pagerText = `Page ${currentPage} of ${totalPages}`
</script>

<div bind:this={buttonAnchor}>
  <ActionButton on:click={dropdown.show}>
    {displayValue}
  </ActionButton>
</div>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<Popover
  bind:this={dropdown}
  on:open={setSelectedUI}
  anchor={buttonAnchor}
  resizable={false}
>
  <div class="container">
    <div class="alphabet-area">
      {#each alphabet as letter, idx}
        <span
          class="letter"
          class:letter-selected={letter === selectedLetter}
          on:click={() => switchLetter(letter)}
        >
          {letter}
        </span>
        {#if idx !== alphabet.length - 1}<span>-</span>{/if}
      {/each}
    </div>
    <div class="search-input">
      <Input
        bind:value={searchTerm}
        on:keyup={event => {
          if (event.key === "Enter") {
            searchForIcon()
          }
        }}
        thin
        placeholder="Search icons"
      />
      <Button secondary on:click={searchForIcon}>Search</Button>
      {#if value}
        <Button primary on:click={() => select(null)}>Clear</Button>
      {/if}
    </div>
    <div class="page-area">
      <div class="pager">
        <i
          on:click={() => pageClick(false)}
          class="page-btn ri-arrow-left-line ri-sm"
        />
        <span>{pagerText}</span>
        <i
          on:click={() => pageClick(true)}
          class="page-btn ri-arrow-right-line ri-sm"
        />
      </div>
    </div>
    {#if pagedIcons.length > 0}
      <div class="icon-area">
        {#if !loading}
          {#each pagedIcons as icon}
            <div
              class="icon-container"
              class:selected={value === `ri-${icon}-fill`}
              on:click={() => select(`ri-${icon}-fill`)}
            >
              <div class="icon-preview">
                <i class={`ri-${icon}-fill ri-xl`} />
              </div>
              <div class="icon-label">{icon}-fill</div>
            </div>
            <div
              class="icon-container"
              class:selected={value === `ri-${icon}-line`}
              on:click={() => select(`ri-${icon}-line`)}
            >
              <div class="icon-preview">
                <i class={`ri-${icon}-line ri-xl`} />
              </div>
              <div class="icon-label">{icon}-line</div>
            </div>
          {/each}
        {/if}
      </div>
    {:else}
      <div class="no-icons">No icons found</div>
    {/if}
  </div>
</Popover>

<style>
  .container {
    width: 610px;
    height: 380px;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
    align-items: stretch;
    padding: var(--spacing-l);
    background: var(--spectrum-global-color-gray-100);
  }
  .search-area {
    flex: 0 0 80px;
    display: flex;
    flex-direction: column;
  }
  .icon-area {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 8px;
    justify-content: flex-start;
  }
  .no-icons {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--spectrum-global-color-gray-600);
  }
  .alphabet-area {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
  }
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .search-input {
    display: flex;
    gap: 10px;
  }
  .search-input :global(> :first-child) {
    flex: 1 1 auto;
  }
  .page-area {
    display: flex;
    justify-content: center;
    user-select: none;
  }
  .pager {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }
  .page-area i {
    font-size: 16px;
    transition: color 130ms ease-out;
  }
  .page-area i:hover {
    color: var(--spectrum-global-color-blue-600);
    cursor: pointer;
  }
  .letter {
    color: var(--spectrum-global-color-gray-700);
    transition: color 130ms ease-out;
  }
  .letter:hover {
    cursor: pointer;
  }
  .letter-selected,
  .letter:hover {
    color: var(--spectrum-global-color-blue-600);
  }
  .icon-container {
    height: 60px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    border: 1px solid var(--spectrum-global-color-gray-400);
    border-radius: 4px;
    transition: background 130ms ease-out;
  }
  .icon-container:hover {
    cursor: pointer;
    background: var(--spectrum-global-color-gray-200);
  }
  .icon-container.selected {
    background: var(--spectrum-global-color-gray-300);
  }
  .icon-preview {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .icon-label {
    flex: 0 0 20px;
    text-align: center;
    font-size: 12px;
    margin-bottom: 2px;
    color: var(--spectrum-global-color-gray-700);
  }
  .page-btn {
    color: var(--spectrum-global-color-gray-700);
  }
  .page-btn:hover {
    cursor: pointer;
  }
</style>
