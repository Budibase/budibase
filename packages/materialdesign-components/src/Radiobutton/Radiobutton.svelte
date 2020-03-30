<script>
  import { onMount, onDestroy } from "svelte"
  import Formfield from "../Common/Formfield.svelte"
  import ClassBuilder from "../ClassBuilder.js"
  import { MDCRadio } from "@material/radio"
  import { generate } from "shortid"

  export let onClick = item => {}
  export let _bb

  export let id = ""
  export let label = ""
  export let value = ""
  export let name = "radios"
  export let checked = false
  export let disabled = false
  export let alignEnd = false

  let _id
  let instance = null
  let radiobtn = null
  let selectedItems
  let radioProps

  let context = _bb.getContext("BBMD:input:context")

  onMount(() => {
    _id = generate()

    if (!!radiobtn) {
      instance = new MDCRadio(radiobtn)
      if (context !== "list-item") {
        let fieldStore = _bb.getContext("BBMD:field-element")
        fieldStore.setInput(instance)
      }
    }
    if (context === "radiobuttongroup") {
      selectedItems = _bb.getContext("BBMD:radiobutton:selectedItemsStore")
      radioProps = _bb.getContext("BBMD:radiobutton:props")
      name = radioProps.name
    }
  })

  function handleOnClick() {
    let item = { _id, label, value }
    if (context === "radiobuttongroup") {
      selectedItems.addSingleItem(item)
    } else {
      _bb.call(onClick, item)
    }
  }

  let extras = null

  if (context === "list-item") {
    extras = ["mdc-list-item__meta"]
  }

  const cb = new ClassBuilder("radio")

  $: isChecked =
    context === "radiobuttongroup"
      ? $selectedItems && $selectedItems.findIndex(i => i._id === _id) > -1
      : checked

  $: isAlignedEnd =
    context === "radiobuttongroup" && !!radioProps
      ? radioProps.alignEnd
      : alignEnd

  $: isDisabled =
    context === "radiobuttongroup" && !!radioProps
      ? radioProps.disabled
      : disabled

  $: modifiers = { disabled: isDisabled }
  $: props = { modifiers, extras }

  $: blockClass = cb.build({ props })
</script>

{#if context !== 'list-item'}
  <Formfield {id} {_bb} {label} alignEnd={isAlignedEnd}>
    <div class={blockClass}>
      <input
        {id}
        class={cb.elem`native-control`}
        type="radio"
        {name}
        {checked}
        disabled={isDisabled}
        on:click={handleOnClick} />
      <div class={cb.elem`background`}>
        <div class={cb.elem`outer-circle`} />
        <div class={cb.elem`inner-circle`} />
      </div>
      <div class={cb.elem`ripple`} />
    </div>
  </Formfield>
{:else}
  <div class={blockClass}>
    <input
      {id}
      class={cb.elem`native-control`}
      type="radio"
      {name}
      {checked}
      disabled={isDisabled}
      on:click={handleOnClick} />
    <div class={cb.elem`background`}>
      <div class={cb.elem`outer-circle`} />
      <div class={cb.elem`inner-circle`} />
    </div>
    <div class={cb.elem`ripple`} />
  </div>
{/if}
