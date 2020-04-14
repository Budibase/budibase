<script>
  import { onMount, onDestroy } from "svelte"
  import Formfield from "../Common/Formfield.svelte"
  import { fieldStore } from "../Common/FormfieldStore.js"
  import ClassBuilder from "../ClassBuilder.js"
  import { MDCCheckbox } from "@material/checkbox"
  import { generate } from "shortid"

  export let onChange = item => {}

  export let _bb

  export let id = ""
  export let value = null
  export let label = ""
  export let disabled = false
  export let alignEnd = false
  export let indeterminate = false
  export let checked = false

  let _id
  let instance = null
  let checkbox = null
  let selectedItems
  let checkProps

  let context = _bb.getContext("BBMD:input:context")

  onMount(() => {
    _id = generate()

    if (!!checkbox) {
      instance = new MDCCheckbox(checkbox)
      instance.indeterminate = indeterminate
      if (context !== "list-item") {
        let fieldStore = _bb.getContext("BBMD:field-element")
        if (fieldStore) fieldStore.setInput(instance)
      }
    }

    if (context === "checkboxgroup") {
      selectedItems = _bb.getContext("BBMD:checkbox:selectedItemsStore")
      checkProps = _bb.getContext("BBMD:checkbox:props")
    }
  })

  let extras = null

  if (context === "list-item") {
    extras = ["mdc-list-item__meta"]
  }

  const cb = new ClassBuilder("checkbox")
  let modifiers = { disabled }
  let props = { modifiers, extras }

  const blockClass = cb.build({ props })

  function changed(e) {
    const val = e.target.checked
    checked = val

    handleOnClick()
    if (_bb.isBound(_bb.props.checked)) {
      _bb.setStateFromBinding(_bb.props.checked, val)
    }
  }

  function handleOnClick() {
    let item = { _id, checked, label, value }
    if (context === "checkboxgroup") {
      let idx = selectedItems.getItemIdx($selectedItems, _id)
      if (idx > -1) {
        selectedItems.removeItem(_id)
      } else {
        selectedItems.addItem(item)
      }
    }
    _bb.call(onChange, item)
  }

  $: isChecked =
    context === "checkboxgroup"
      ? $selectedItems && $selectedItems.findIndex(i => i._id === _id) > -1
      : checked

  $: isAlignedEnd =
    context === "checkboxgroup" && !!checkProps ? checkProps.alignEnd : alignEnd

  $: isDisabled =
    context === "checkboxgroup" && !!checkProps ? checkProps.disabled : disabled
</script>

<!-- TODO: Customizing Colour and Density - What level of customization for these things does Budibase need here? -->

{#if context !== 'list-item'}
  <div class="bbmd-checkbox">
    <Formfield {label} {_bb} {id} alignEnd={isAlignedEnd}>
      <div bind:this={checkbox} class={blockClass}>
        <input
          type="checkbox"
          class={cb.elem`native-control`}
          {id}
          disabled={isDisabled}
          checked={isChecked}
          on:change={changed} />
        <div class={cb.elem`background`}>
          <svg class={cb.elem`checkmark`} viewBox="0 0 24 24">
            <path
              class={cb.elem`checkmark-path`}
              fill="none"
              d="M1.73,12.91 8.1,19.28 22.79,4.59" />
          </svg>
          <div class={cb.elem`mixedmark`} />
        </div>
        <div class={cb.elem`ripple`} />
      </div>
    </Formfield>
  </div>
{:else}
  <div bind:this={checkbox} class={blockClass}>
    <input
      type="checkbox"
      class={cb.elem`native-control`}
      {id}
      disabled={isDisabled}
      checked={isChecked}
      on:change={changed} />
    <div class={cb.elem`background`}>
      <svg class={cb.elem`checkmark`} viewBox="0 0 24 24">
        <path
          class={cb.elem`checkmark-path`}
          fill="none"
          d="M1.73,12.91 8.1,19.28 22.79,4.59" />
      </svg>
      <div class={cb.elem`mixedmark`} />
    </div>
    <div class={cb.elem`ripple`} />
  </div>
{/if}

<style>
  .bbmd-checkbox {
    width: fit-content;
  }
</style>
