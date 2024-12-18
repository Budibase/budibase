<script>
  import { flip } from "svelte/animate"
  import { dndzone } from "svelte-dnd-action"
  import { Icon, Popover } from "@budibase/bbui"
  import { tick } from "svelte"
  import { Constants } from "@budibase/frontend-core"
  import { getSequentialName } from "@/helpers/duplicate"
  import { derived, writable } from "svelte/store"

  export let constraints
  export let optionColors = {}
  export let valid = true

  const flipDurationMs = 130
  const { OptionColours } = Constants
  const getDefaultColor = idx => OptionColours[idx % OptionColours.length]
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
          <Icon name="DragHandle" size="L" />
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
              <div class="colors" data-ignore-click-outside="true">
                {#each OptionColours as colorOption}
                  <div
                    on:click={() => handleColorChange(option.id, colorOption)}
                    style="--color:{colorOption};"
                    class="circle"
                    class:selected={colorOption === option.color}
                  />
                {/each}
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
          name="Close"
          hoverable
          size="S"
          on:click={() => removeInput(option.id)}
        />
      </div>
    {/each}
  </div>
  <div on:click={addNewInput} class="add-option">
    <Icon name="Add" />
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
    transition: background-color 130ms ease-in-out, color 130ms ease-in-out,
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
  .colors {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: var(--spacing-xl);
    justify-items: center;
    margin: var(--spacing-m);
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
