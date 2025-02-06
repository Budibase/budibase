<script>
  import Popover from "../Popover/Popover.svelte"
  import Layout from "../Layout/Layout.svelte"
  import { createEventDispatcher } from "svelte"
  import "@spectrum-css/popover/dist/index-vars.css"
  import Icon from "../Icon/Icon.svelte"
  import Input from "../Form/Input.svelte"
  import { capitalise } from "../helpers"
  import {
    ensureValidTheme,
    getThemeClassNames,
    DefaultAppTheme,
  } from "@budibase/shared-core"

  export let value
  export let size = "M"
  export let spectrumTheme
  export let offset
  export let align

  let dropdown
  let preview

  $: customValue = getCustomValue(value)
  $: checkColor = getCheckColor(value)
  $: themeClasses = getThemeClasses(spectrumTheme)

  const dispatch = createEventDispatcher()
  const categories = [
    {
      label: "Theme",
      colors: [
        "gray-50",
        "gray-75",
        "gray-100",
        "gray-200",
        "gray-300",
        "gray-400",
        "gray-500",
        "gray-600",
        "gray-700",
        "gray-800",
        "gray-900",
      ],
    },
    {
      label: "Colors",
      colors: [
        "red-100",
        "orange-100",
        "yellow-100",
        "green-100",
        "seafoam-100",
        "blue-100",
        "indigo-100",
        "magenta-100",

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

        "static-white",
        "static-black",
      ],
    },
  ]

  const getThemeClasses = theme => {
    if (!theme) {
      return ""
    }
    theme = ensureValidTheme(theme, DefaultAppTheme)
    return getThemeClassNames(theme)
  }

  const onChange = value => {
    dispatch("change", value)
    dropdown.hide()
  }

  const getCustomValue = value => {
    if (!value) {
      return value
    }
    let found = false
    const comparisonValue = value.substring(28, value.length - 1)
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
    // Use dynamic color for theme grays
    if (value?.includes("-gray-")) {
      return /^.*(gray-(50|75|100|200|300|400|500))\)$/.test(value)
        ? "var(--spectrum-global-color-gray-900)"
        : "var(--spectrum-global-color-gray-50)"
    }

    // Use contrasating check for the dim colours
    if (value?.includes("-100")) {
      return "var(--spectrum-global-color-gray-900)"
    }

    // Use black check for static white
    if (value?.includes("static-black")) {
      return "var(--spectrum-global-color-static-gray-50)"
    }

    return "var(--spectrum-global-color-static-gray-900)"
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  bind:this={preview}
  class="preview size--{size || 'M'}"
  on:click={() => {
    dropdown.toggle()
  }}
>
  <div
    class="fill {themeClasses}"
    style={value ? `background: ${value};` : ""}
    class:placeholder={!value}
  />
</div>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<Popover bind:this={dropdown} anchor={preview} maxHeight={320} {offset} {align}>
  <Layout paddingX="XL" paddingY="L">
    <div class="container">
      {#each categories as category}
        <div class="category">
          <div class="heading">{category.label}</div>
          <div class="colors">
            {#each category.colors as color}
              <div
                on:click={() => {
                  onChange(`var(--spectrum-global-color-${color})`)
                }}
                class="color"
                title={prettyPrint(color)}
              >
                <div
                  class="fill {themeClasses}"
                  style="background: var(--spectrum-global-color-{color}); color: {checkColor};"
                >
                  {#if value === `var(--spectrum-global-color-${color})`}
                    <Icon name="Checkmark" size="S" />
                  {/if}
                </div>
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
  </Layout>
</Popover>

<style>
  .container {
    position: relative;
  }
  .preview {
    width: 32px;
    height: 32px;
    border-radius: 100%;
    position: relative;
    transition: border-color 130ms ease-in-out;
    box-shadow: 0 0 0 1px var(--spectrum-global-color-gray-400);
  }
  .preview:hover {
    cursor: pointer;
    box-shadow: 0 0 2px 2px var(--spectrum-global-color-gray-400);
  }
  .fill {
    width: 100%;
    height: 100%;
    border-radius: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: grid;
    place-items: center;
  }
  .fill.placeholder {
    background-position: 0 0, 10px 10px;
    background-size: 20px 20px;
    background-image: linear-gradient(
        45deg,
        #eee 25%,
        transparent 25%,
        transparent 75%,
        #eee 75%,
        #eee 100%
      ),
      linear-gradient(
        45deg,
        #eee 25%,
        white 25%,
        white 75%,
        #eee 75%,
        #eee 100%
      );
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
    position: relative;
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
  .container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }
  .spectrum-wrapper {
    background-color: transparent;
  }
</style>
