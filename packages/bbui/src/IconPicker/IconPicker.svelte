<script lang="ts">
  import "@spectrum-css/popover/dist/index-vars.css"
  import clickOutside from "../Actions/click_outside"
  import { fly } from "svelte/transition"
  import Icon from "../Icon/Icon.svelte"
  import { createEventDispatcher } from "svelte"

  export let value: string | undefined
  export let size: "S" | "M" | "L" = "M"
  export let alignRight: boolean = false

  let open: boolean = false

  const dispatch = createEventDispatcher()

  interface IconCategory {
    label: string
    icons: string[]
  }

  const iconList: IconCategory[] = [
    {
      label: "Icons",
      icons: [
        "squares-four",
        "cursor-click",
        "funnel",
        "squares-four",
        "briefcase",
        "coins",
        "shopping-cart",
        "note",
        "question",
        "activity",
        "flask",
        "briefcase",
        "tree-structure",
        "magnifying-glass-plus",
        "rocket-launch",
        "car",
        "camera",
        "bug",
        "share-network",
        "calculator",
        "calendar",
        "chart-donut",
        "chart-bar-horizontal",
        "users-three",
      ],
    },
  ]

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
  <div class="preview size--{size || 'M'}" on:click={() => (open = true)}>
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
      {#each iconList as iconList}
        <div class="category">
          <div class="heading">{iconList.label}</div>
          <div class="icons">
            {#each iconList.icons as icon}
              <div
                on:click={() => {
                  onChange(icon)
                }}
              >
                <Icon name={icon} />
              </div>
            {/each}
          </div>
        </div>
      {/each}
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
  .size--S {
    width: 20px;
    height: 20px;
  }
  .size--M {
    width: 32px;
    height: 32px;
  }
  .size--L {
    width: 48px;
    height: 48px;
  }
  .spectrum-Popover {
    width: 210px;
    z-index: 999;
    top: 100%;
    padding: var(--spacing-l) var(--spacing-xl);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-xl);
  }
  .spectrum-Popover--align-right {
    right: 0;
  }
  .icons {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    gap: var(--spacing-m);
  }
  .heading {
    font-size: var(--font-size-s);
    font-weight: 600;
    letter-spacing: 0.14px;
    flex: 1 1 auto;
    text-transform: uppercase;
    grid-column: 1 / 5;
    margin-bottom: var(--spacing-s);
  }

  .icon {
    height: 16px;
    width: 16px;
    border-radius: 100%;
    box-shadow: 0 0 0 1px var(--spectrum-global-color-gray-300);
    position: relative;
  }
  .icon:hover {
    cursor: pointer;
    box-shadow: 0 0 2px 2px var(--spectrum-global-color-gray-300);
  }
  .custom {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: var(--spacing-m);
    margin-right: var(--spacing-xs);
  }

  .spectrum-wrapper {
    background-color: transparent;
  }
</style>
