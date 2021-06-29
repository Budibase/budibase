<script>
  import { createEventDispatcher } from "svelte"
  import "@spectrum-css/popover/dist/index-vars.css"
  import clickOutside from "../Actions/click_outside"
  import { fly } from "svelte/transition"
  import Icon from "../Icon/Icon.svelte"
  import Input from "../Form/Input.svelte"
  import { capitalise } from "../utils/helpers"

  export let value
  export let size = "M"

  let open = false

  $: color = value || "transparent"
  $: customValue = getCustomValue(value)
  $: checkColor = getCheckColor(value)

  const dispatch = createEventDispatcher()
  const categories = [
    {
      label: "Grays",
      colors: [
        "white",
        "gray-100",
        "gray-200",
        "gray-300",
        "gray-400",
        "gray-500",
        "gray-600",
        "gray-700",
        "gray-800",
        "gray-900",
        "black",
      ],
    },
    {
      label: "Colors",
      colors: [
        "red-400",
        "orange-400",
        "yellow-400",
        "green-400",
        "seafoam-400",
        "blue-400",
        "indigo-400",
        "magenta-400",

        "red-500",
        "orange-500",
        "yellow-500",
        "green-500",
        "seafoam-500",
        "blue-500",
        "indigo-500",
        "magenta-500",

        "red-600",
        "orange-600",
        "yellow-600",
        "green-600",
        "seafoam-600",
        "blue-600",
        "indigo-600",
        "magenta-600",

        "red-700",
        "orange-700",
        "yellow-700",
        "green-700",
        "seafoam-700",
        "blue-700",
        "indigo-700",
        "magenta-700",
      ],
    },
  ]

  const onChange = value => {
    dispatch("change", value)
    open = false
  }

  const getCustomValue = value => {
    if (!value) {
      return value
    }
    let found = false
    const comparisonValue = value.substring(35, value.length - 1)
    for (let category of categories) {
      found = category.colors.includes(comparisonValue)
      if (found) {
        break
      }
    }
    return found ? null : value
  }

  const prettyPrint = color => {
    return capitalise(color.split("-").join(" "))
  }

  const getCheckColor = value => {
    return /^.*(white|(gray-(50|75|100|200|300|400|500)))\)$/.test(value)
      ? "black"
      : "white"
  }
</script>

<div class="container">
  <div
    class="preview size--{size || 'M'}"
    style="background: {color};"
    on:click={() => (open = true)}
  />
  {#if open}
    <div
      use:clickOutside={() => (open = false)}
      transition:fly={{ y: -20, duration: 200 }}
      class="spectrum-Popover spectrum-Popover--bottom spectrum-Picker-popover is-open"
    >
      {#each categories as category}
        <div class="category">
          <div class="heading">{category.label}</div>
          <div class="colors">
            {#each category.colors as color}
              <div
                on:click={() => {
                  onChange(`var(--spectrum-global-color-static-${color})`)
                }}
                class="color"
                style="background: var(--spectrum-global-color-static-{color}); color: {checkColor};"
                title={prettyPrint(color)}
              >
                {#if value === `var(--spectrum-global-color-static-${color})`}
                  <Icon name="Checkmark" size="S" />
                {/if}
              </div>
            {/each}
          </div>
        </div>
      {/each}
      <div class="category category--custom">
        <div class="heading">Custom</div>
        <div class="custom">
          <Input
            updateOnChange={false}
            quiet
            placeholder="Hex, RGB, HSL..."
            value={customValue}
            on:change
          />
          <Icon
            size="S"
            name="Close"
            hoverable
            on:click={() => onChange(null)}
          />
        </div>
      </div>
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
    border-radius: 100%;
    transition: border-color 130ms ease-in-out;
    box-shadow: 0 0 0 1px var(--spectrum-global-color-gray-300);
  }
  .preview:hover {
    cursor: pointer;
    box-shadow: 0 0 2px 2px var(--spectrum-global-color-gray-300);
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
  .colors {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    gap: var(--spacing-xs);
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
  .color {
    height: 16px;
    width: 16px;
    border-radius: 100%;
    box-shadow: 0 0 0 1px var(--spectrum-global-color-gray-300);
    display: grid;
    place-items: center;
  }
  .color:hover {
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
  .category--custom .heading {
    margin-bottom: var(--spacing-xs);
  }
</style>
