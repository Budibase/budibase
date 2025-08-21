<script lang="ts">
  import "@spectrum-css/popover/dist/index-vars.css"
  import Icon from "../Icon/Icon.svelte"
  import { createEventDispatcher } from "svelte"
  import { PhosphorIcons } from "./icons"
  import TextField from "../Form/Core/TextField.svelte"
  import { ActionButton, Body, PopoverAlignment } from "@budibase/bbui"
  import Popover from "../Popover/Popover.svelte"

  export let value: string | undefined

  let open: boolean = false
  let anchor: HTMLDivElement
  let searchString = ""

  const dispatch = createEventDispatcher()

  $: icons = searchIcons(searchString)

  const searchIcons = (searchString: string) => {
    if (!searchString) {
      return PhosphorIcons
    }
    const lower = searchString.toLowerCase()
    return PhosphorIcons.filter(icon => icon.includes(lower))
  }

  const onChange = (value?: string) => {
    dispatch("change", value)
    open = false
  }

  const openPicker = () => {
    searchString = ""
    open = true
  }
</script>

<div class="preview" bind:this={anchor}>
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

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<Popover
  {anchor}
  {open}
  align={PopoverAlignment.Left}
  on:close={() => (open = false)}
  maxHeight={225}
>
  <div class="popover">
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
            class:selected={icon === value}
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
</Popover>

<style>
  .preview {
    display: flex;
    gap: 8px;
  }
  .popover {
    padding: var(--spacing-s) var(--spacing-l) var(--spacing-m) var(--spacing-l);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
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
  .icon.selected {
    color: var(--spectrum-global-color-blue-600);
  }
  .icon:hover {
    cursor: pointer;
    background-color: var(--spectrum-global-color-gray-100);
  }
</style>
