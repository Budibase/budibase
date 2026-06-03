<script>
  import { flip } from "svelte/animate"
  import { dndzone } from "svelte-dnd-action"
  import { Icon, Input, Popover } from "@budibase/bbui"
  import { tick, onMount, onDestroy } from "svelte"
  import { Constants } from "@budibase/frontend-core"
  import { getSequentialName } from "@/helpers/duplicate"
  import { derived, writable } from "svelte/store"
  import { appStore } from "@/stores/builder"

  export let constraints
  export let optionColors = {}
  export let valid = true

  const flipDurationMs = 130
  const { OptionColours } = Constants
  const getDefaultColor = idx => OptionColours[idx % OptionColours.length]

  const MAX_SAVED_COLORS = 8

  import { get } from "svelte/store"

  let savedColorsKey = null
  let savedColors = []

  const loadSavedColors = key => {
    if (!key) {
      savedColors = []
      return
    }
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        savedColors = JSON.parse(stored)
      } catch (e) {
        savedColors = []
      }
    } else {
      savedColors = []
    }
  }

  onMount(() => {
    // Use the current appId at mount time to form a stable key.
    const appId = get(appStore)?.appId
    savedColorsKey = appId ? `budibase-saved-option-colors-${appId}` : null
    loadSavedColors(savedColorsKey)

    // Subscribe to appStore to reload saved colors if app changes (e.g., after a rebase or navigation)
    const unsub = appStore.subscribe(state => {
      const nextKey = state?.appId
        ? `budibase-saved-option-colors-${state.appId}`
        : null
      if (nextKey !== savedColorsKey) {
        savedColorsKey = nextKey
        loadSavedColors(savedColorsKey)
      }
    })

    onDestroy(unsub)
  })

  const saveCustomColor = color => {
    if (!color || savedColors.includes(color) || OptionColours.includes(color))
      return
    if (savedColors.length >= MAX_SAVED_COLORS) {
      // Remove oldest and add new
      savedColors = [...savedColors.slice(1), color]
    } else {
      savedColors = [...savedColors, color]
    }
    localStorage.setItem(savedColorsKey, JSON.stringify(savedColors))
  }

  const removeSavedColor = color => {
    savedColors = savedColors.filter(c => c !== color)
    localStorage.setItem(savedColorsKey, JSON.stringify(savedColors))
  }
  const options = writable(
    constraints.inclusion.map((value, idx) => ({
      id: Math.random(),
      name: value,
      color: optionColors?.[value] || getDefaultColor(idx),
      invalid: false,
    }))
  )
  const enrichedOptions = derived(options, $options => {
    let enriched = []
    $options.forEach(option => {
      enriched.push({
        ...option,
        valid: option.name && !enriched.some(opt => opt.name === option.name),
      })
    })
    return enriched
  })

  let openOption = null
  let anchor = null

  $: options.subscribe(updateConstraints)
  $: valid = $enrichedOptions.every(option => option.valid)

  const updateConstraints = options => {
    constraints.inclusion = options.map(option => option.name)
    optionColors = options.reduce(
      (colors, option) => ({ ...colors, [option.name]: option.color }),
      {}
    )
  }

  const addNewInput = async () => {
    const newId = Math.random()
    const newName = getSequentialName($options, "Option ", {
      numberFirstItem: true,
      getName: option => option.name,
    })
    options.update(state => {
      return [
        ...state,
        {
          name: newName,
          id: newId,
          color: getDefaultColor(state.length),
        },
      ]
    })

    // Focus new option
    await tick()
    document.getElementById(`option-${newId}`)?.focus()
  }

  const removeInput = id => {
    options.update(state => state.filter(option => option.id !== id))
  }

  const openColorPicker = id => {
    anchor = document.getElementById(`color-${id}`)
    openOption = id
  }

  const handleColorChange = (id, color) => {
    options.update(state => {
      state.find(option => option.id === id).color = color
      return state.slice()
    })
    openOption = null
  }

  const handleCustomColorInput = (id, value) => {
    if (!value) return
    options.update(state => {
      state.find(option => option.id === id).color = value
      return state.slice()
    })
  }

  const handleSaveCustomColor = (id, color) => {
    if (!isCustomColor(color)) return
    saveCustomColor(color)
  }

  const isCustomColor = color => {
    return color && !OptionColours.includes(color)
  }

  const handleNameChange = (id, name) => {
    options.update(state => {
      state.find(option => option.id === id).name = name
      return state.slice()
    })
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="wrapper">
  <div
    class="options"
    use:dndzone={{
      items: $options,
      flipDurationMs,
      dropTargetStyle: { outline: "none" },
    }}
    on:consider={e => options.set(e.detail.items)}
    on:finalize={e => options.set(e.detail.items)}
  >
    {#each $enrichedOptions as option (option.id)}
      <div
        class="option"
        animate:flip={{ duration: flipDurationMs }}
        class:invalid={!option.valid}
      >
        <div class="drag-handle">
          <Icon name="dots-six-vertical" size="L" />
        </div>
        <div
          id="color-{option.id}"
          class="color-picker"
          on:click={() => openColorPicker(option.id)}
        >
          <div class="circle" style="--color:{option.color}">
            <Popover
              open={openOption === option.id}
              {anchor}
              align="left"
              offset={0}
              animate={false}
              resizable={false}
            >
              <div class="color-popover" data-ignore-click-outside="true">
                <div class="colors">
                  {#each OptionColours as colorOption}
                    <div
                      on:click={() => handleColorChange(option.id, colorOption)}
                      style="--color:{colorOption};"
                      class="circle"
                      class:selected={colorOption === option.color}
                    ></div>
                  {/each}
                </div>
                {#if savedColors.length > 0}
                  <div class="saved-colors">
                    <div class="custom-color-label">Saved</div>
                    <div class="saved-colors-grid">
                      {#each savedColors as saved}
                        <div class="saved-circle-wrapper">
                          <div
                            on:click={() => handleColorChange(option.id, saved)}
                            style="--color:{saved};"
                            class="circle"
                            class:selected={saved === option.color}
                          ></div>
                          <div
                            class="remove-saved"
                            on:click|stopPropagation={() =>
                              removeSavedColor(saved)}
                          >
                            <Icon hoverable name="x" size="XS" />
                          </div>
                        </div>
                      {/each}
                    </div>
                  </div>
                {/if}
                <div class="custom-color">
                  <div class="custom-color-label">Custom</div>
                  <div class="custom-color-input">
                    <input
                      type="color"
                      class="native-color-input"
                      value={isCustomColor(option.color)
                        ? option.color
                        : "#000000"}
                      on:input={e =>
                        handleCustomColorInput(option.id, e.target.value)}
                    />
                    <Input
                      updateOnChange={false}
                      quiet
                      placeholder="Hex or RGB..."
                      value={isCustomColor(option.color) ? option.color : ""}
                      on:change={e =>
                        handleCustomColorInput(option.id, e.detail)}
                    />
                    {#if isCustomColor(option.color)}
                      <div
                        class="save-color-btn"
                        class:disabled={savedColors.length >=
                          MAX_SAVED_COLORS ||
                          savedColors.includes(option.color)}
                        title={savedColors.includes(option.color)
                          ? "Already saved"
                          : savedColors.length >= MAX_SAVED_COLORS
                            ? "Max saved colors reached"
                            : "Save to palette"}
                        on:click={() =>
                          !savedColors.includes(option.color) &&
                          savedColors.length < MAX_SAVED_COLORS &&
                          handleSaveCustomColor(option.id, option.color)}
                      >
                        <Icon name="plus" size="S" />
                      </div>
                    {/if}
                  </div>
                </div>
              </div>
            </Popover>
          </div>
        </div>
        <input
          class="option-name"
          type="text"
          value={option.name}
          placeholder="Option name"
          id="option-{option.id}"
          on:input={e => handleNameChange(option.id, e.target.value)}
        />
        <Icon
          name="x"
          hoverable
          size="S"
          on:click={() => removeInput(option.id)}
        />
      </div>
    {/each}
  </div>
  <div on:click={addNewInput} class="add-option">
    <Icon name="plus" />
    <div>Add option</div>
  </div>
</div>

<style>
  /* Container */
  .wrapper {
    overflow: hidden;
    border-radius: 4px;
    border: 1px solid var(--spectrum-global-color-gray-300);
    background-color: var(--spectrum-global-color-gray-50);
  }
  .options > *,
  .add-option {
    height: 32px;
  }

  /* Options row */
  .option {
    transition:
      background-color 130ms ease-in-out,
      color 130ms ease-in-out,
      border-color 130ms ease-in-out;
    display: flex;
    flex-direction: row;
    align-items: center;
    border: 1px solid transparent;
    border-bottom: 1px solid var(--spectrum-global-color-gray-300);
    gap: var(--spacing-m);
    padding: 0 var(--spacing-m) 0 var(--spacing-s);
    outline: none !important;
  }
  .option.invalid {
    border: 1px solid var(--spectrum-global-color-red-400);
  }
  .option:not(.invalid):hover,
  .option:not(.invalid):focus {
    background: var(--spectrum-global-color-gray-100);
  }

  /* Option row components */
  .color-picker {
    align-self: stretch;
    display: grid;
    place-items: center;
  }
  .circle {
    height: 20px;
    width: 20px;
    background-color: var(--color);
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    border: 1px solid transparent;
    transition: border 130ms ease-out;
  }
  .circle:hover,
  .circle.selected {
    border: 1px solid var(--spectrum-global-color-blue-600);
    cursor: pointer;
  }
  .color-popover {
    padding: var(--spacing-m);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }
  .colors {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: var(--spacing-xl);
    justify-items: center;
  }
  .custom-color {
    border-top: 1px solid var(--spectrum-global-color-gray-200);
    padding-top: var(--spacing-m);
  }
  .custom-color-label {
    font-size: var(--font-size-s);
    font-weight: 600;
    letter-spacing: 0.14px;
    text-transform: uppercase;
    margin-bottom: var(--spacing-s);
    color: var(--spectrum-global-color-gray-700);
  }
  .custom-color-input {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }
  .native-color-input {
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 50%;
    padding: 0;
    cursor: pointer;
    background: none;
    flex-shrink: 0;
  }
  .save-color-btn {
    display: grid;
    place-items: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 1px solid var(--spectrum-global-color-gray-400);
    cursor: pointer;
    flex-shrink: 0;
    transition:
      background-color 130ms ease-out,
      border-color 130ms ease-out,
      opacity 130ms ease-out;
  }
  .save-color-btn:not(.disabled):hover {
    background-color: var(--spectrum-global-color-gray-200);
    border-color: var(--spectrum-global-color-blue-500);
  }
  .save-color-btn.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .saved-colors {
    border-top: 1px solid var(--spectrum-global-color-gray-200);
    padding-top: var(--spacing-m);
  }
  .saved-colors-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: var(--spacing-xl);
    justify-items: center;
    margin-top: var(--spacing-s);
  }
  .saved-circle-wrapper {
    position: relative;
    display: inline-flex;
  }
  .saved-circle-wrapper .remove-saved {
    display: none;
    position: absolute;
    top: -6px;
    right: -6px;
  }
  .saved-circle-wrapper:hover .remove-saved {
    display: block;
  }
  .native-color-input::-webkit-color-swatch-wrapper {
    padding: 0;
    border-radius: 50%;
  }
  .native-color-input::-webkit-color-swatch {
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 50%;
  }
  .option-name {
    border: none;
    outline: none;
    background-color: transparent;
    width: 100%;
    color: var(--text);
  }

  /* Add option */
  .add-option {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: var(--spacing-m);
    gap: var(--spacing-m);
  }
  .add-option:hover {
    cursor: pointer !important;
    background: var(--spectrum-global-color-gray-200);
  }
</style>
