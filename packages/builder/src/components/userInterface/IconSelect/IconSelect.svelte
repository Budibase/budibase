<script>
  import { DropdownMenu, Button, Input } from "@budibase/bbui"
  import { createEventDispatcher, tick } from "svelte"

  import icons from "./icons.js"

  const dispatch = createEventDispatcher()

  export let value = ""
  export let maxIconsPerPage = 30

  let searchTerm = ""
  let selectedLetter = "A"

  let currentPage = 1
  let filteredIcons = findIconByTerm(selectedLetter)

  $: dispatch("change", value)

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
    const r = new RegExp(`\^${term}`, "i")
    return icons.filter(i => r.test(i.label))
  }

  async function switchLetter(letter) {
    currentPage = 1
    searchTerm = ""
    loading = true
    selectedLetter = letter
    filteredIcons = findIconByTerm(letter)
    await tick()
    loading = false
  }

  async function findIconOnPage() {
    loading = true
    const iconIdx = filteredIcons.findIndex(i => i.value === value)
    if (iconIdx !== -1) {
      currentPage = Math.ceil(iconIdx / maxIconsPerPage)
    }
    await tick()
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
    await tick()
    loading = false
  }

  async function searchForIcon(e) {
    currentPage = 1
    loading = true
    filteredIcons = findIconByTerm(searchTerm)
    await tick()
    loading = false
  }

  $: displayValue = value ? value.substring(7) : "Pick Icon"

  $: totalPages = Math.ceil(filteredIcons.length / maxIconsPerPage)
  $: pageEndIdx = maxIconsPerPage * currentPage
  $: pagedIcons = filteredIcons.slice(pageEndIdx - maxIconsPerPage, pageEndIdx)

  $: pagerText = `Page ${currentPage} of ${totalPages}`
</script>

<div bind:this={buttonAnchor}>
  <Button secondary on:click={dropdown.show}>{displayValue}</Button>
</div>
<DropdownMenu
  bind:this={dropdown}
  on:open={setSelectedUI}
  anchor={buttonAnchor}>
  <div class="container">
    <div class="search-area">
      <div class="alphabet-area">
        {#each alphabet as letter, idx}
          <span
            class="letter"
            class:letter-selected={letter === selectedLetter}
            on:click={() => switchLetter(letter)}>
            {letter}
          </span>
          {#if idx !== alphabet.length - 1}
            <span>-</span>
          {/if}
        {/each}
      </div>
      <div class="search-input">
        <div class="input-wrapper">
          <Input bind:value={searchTerm} thin placeholder="Search Icon" />
        </div>
        <Button secondary on:click={searchForIcon}>Search</Button>
      </div>
      <div class="page-area">
        <div class="pager">
          <span on:click={() => pageClick(false)}>
            <i class="page-btn fas fa-chevron-left" />
          </span>
          <span>{pagerText}</span>
          <span on:click={() => pageClick(true)}>
            <i class="page-btn fas fa-chevron-right" />
          </span>
        </div>
      </div>
    </div>
    {#if pagedIcons.length > 0}
      <div class="icon-area">
        {#if !loading}
          {#each pagedIcons as icon}
            <div
              class="icon-container"
              class:selected={value === icon.value}
              on:click={() => (value = icon.value)}>
              <div class="icon-preview">
                <i class={`${icon.value} fa-3x`} />
              </div>
              <div class="icon-label">{icon.label}</div>
            </div>
          {/each}
        {/if}
      </div>
    {:else}
      <div class="no-icons">
        <h5>
          {`There is no icons for this ${searchTerm ? 'search' : 'page'}`}
        </h5>
      </div>
    {/if}
  </div>
</DropdownMenu>

<style>
  .container {
    width: 610px;
    height: 350px;
    display: flex;
    flex-direction: column;
    padding: 10px 0px 10px 15px;
    overflow-x: hidden;
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
    grid-gap: 5px;
    justify-content: flex-start;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 10px;
  }

  .no-icons {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .alphabet-area {
    display: flex;
    flex-flow: row wrap;
    padding-bottom: 10px;
    padding-right: 15px;
    justify-content: space-around;
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .search-input {
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
    padding-right: 15px;
  }

  .input-wrapper {
    width: 510px;
    margin-right: 5px;
  }

  .page-area {
    padding: 10px;
    display: flex;
    justify-content: center;
  }

  .letter {
    color: var(--blue);
  }

  .letter:hover {
    cursor: pointer;
    text-decoration: underline;
  }

  .letter-selected {
    text-decoration: underline;
  }

  .icon-container {
    height: 100px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    border: var(--border-dark);
  }

  .icon-container:hover {
    cursor: pointer;
    background: var(--grey-2);
  }

  .selected {
    background: var(--grey-3);
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
  }

  .page-btn {
    color: var(--blue);
  }

  .page-btn:hover {
    cursor: pointer;
  }
</style>
