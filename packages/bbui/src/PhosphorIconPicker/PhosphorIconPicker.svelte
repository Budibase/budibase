<script lang="ts">
  import "@spectrum-css/popover/dist/index-vars.css"
  import clickOutside from "../Actions/click_outside"
  import { fly } from "svelte/transition"
  import Icon from "../Icon/Icon.svelte"
  import { createEventDispatcher } from "svelte"
  import { PhosphorIcons } from "./icons"
  import TextField from "../Form/Core/TextField.svelte"
  import { Body } from "@budibase/bbui"

  export let value: string | undefined
  export let alignRight: boolean = false

  let open: boolean = false
  let searchString = ""

  const dispatch = createEventDispatcher()

  const onChange = (value: string) => {
    dispatch("change", value)
    open = false
  }

  const handleOutsideClick = (event: MouseEvent) => {
    if (open) {
      event.stopPropagation()
      open = false
    }
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="container">
  <div class="preview" on:click={() => (open = true)}>
    <div
      class="fill"
      style={value ? `background: ${value};` : ""}
      class:placeholder={!value}
    >
      <Icon name={value || "users-three"} />
    </div>
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
        bind:value={searchString}
        autocomplete={false}
        placeholder="Search icons"
      />
      <div class="icons">
        {#each PhosphorIcons.slice(0, 250) as icon}
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
      <Body color="var(--spectrum-global-color-gray-600)" size="XS">
        Enter a search string to find more icons
      </Body>
    </div>
  {/if}
</div>

<style>
  .container {
    position: relative;
  }
  .preview {
    width: 32px;
    height: 32px;
    position: relative;
    box-shadow: 0 0 0 1px var(--spectrum-global-color-gray-400);
    border-radius: 4px;
  }
  .preview:hover {
    cursor: pointer;
  }
  .fill {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: grid;
    place-items: center;
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
