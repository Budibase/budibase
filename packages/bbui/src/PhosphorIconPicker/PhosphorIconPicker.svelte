<script lang="ts">
  import "@spectrum-css/popover/dist/index-vars.css"
  import clickOutside from "../Actions/click_outside"
  import { fly } from "svelte/transition"
  import Icon from "../Icon/Icon.svelte"
  import { createEventDispatcher } from "svelte"
  import { PhosphorIcons } from "./icons"
  import TextField from "../Form/Core/TextField.svelte"
  import { ActionButton, Body } from "@budibase/bbui"

  export let value: string | undefined
  export let alignRight: boolean = false

  let open: boolean = false
  let searchString = ""

  const dispatch = createEventDispatcher()

  $: icons = searchIcons(searchString)

  const searchIcons = (searchString: string) => {
    console.log(searchString)
    if (!searchString) {
      return PhosphorIcons
    }
    const lower = searchString.toLowerCase()
    return PhosphorIcons.filter(icon => icon.includes(lower))
  }

  const onChange = (value: string | undefined) => {
    dispatch("change", value)
    open = false
  }

  const handleOutsideClick = (event: MouseEvent) => {
    if (open) {
      event.stopPropagation()
      open = false
    }
  }

  const openPicker = () => {
    searchString = ""
    open = true
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="container">
  <div class="preview">
    <ActionButton on:click={openPicker}>
      {#if value}
        <Icon name={value || "users-three"} />
      {:else}
        Choose icon
      {/if}
    </ActionButton>
    {#if value}
      <Icon name="x" size="S" hoverable on:click={() => onChange()} />
    {/if}
  </div>
  {#if open}
    <div
      use:clickOutside={handleOutsideClick}
      transition:fly={{ y: -20, duration: 200 }}
      class="spectrum-Popover spectrum-Popover--bottom spectrum-Picker-popover is-open"
      class:spectrum-Popover--align-right={alignRight}
    >
      <TextField
        quiet
        value={searchString}
        on:change={e => (searchString = e.detail)}
        autocomplete={false}
        placeholder="Search icons"
        autofocus
      />
      {#if icons.length}
        <div class="icons">
          {#each icons.slice(0, 250) as icon}
            <div
              class="icon"
              on:click={() => {
                onChange(icon)
              }}
            >
              <Icon name={icon} />
            </div>
          {/each}
        </div>
        {#if !searchString}
          <Body color="var(--spectrum-global-color-gray-600)" size="XS">
            Search to find more icons
          </Body>
        {/if}
      {:else}
        <Body color="var(--spectrum-global-color-gray-600)" size="XS">
          No icons found
        </Body>
      {/if}
    </div>
  {/if}
</div>

<style>
  .container {
    position: relative;
  }
  .preview {
    display: flex;
    gap: 8px;
  }
  .spectrum-Popover {
    width: 220px;
    z-index: 999;
    top: 100%;
    padding: var(--spacing-l) var(--spacing-xl);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-xl);
    max-height: 225px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .spectrum-Popover--align-right {
    right: 0;
  }
  .icons {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    gap: var(--spacing-m);
  }
  .icon {
    padding: 4px;
    border-radius: 4px;
    transition: background-color 130ms ease-out;
  }
  .icon:hover {
    cursor: pointer;
    background-color: var(--spectrum-global-color-gray-100);
  }
</style>
