<script>
  import { onMount, onDestroy } from "svelte"
  import Formfield from "../Common/Formfield.svelte"
  import { fieldStore } from "../Common/FormfieldStore.js"
  import ClassBuilder from "../ClassBuilder.js"
  import { MDCCheckbox } from "@material/checkbox"

  export let onClick = item => {}

  export let _bb

  export let id = ""
  export let label = ""
  export let disabled = false
  export let alignEnd = false
  export let indeterminate = false
  export let checked = false

  let instance = null
  let checkbox = null
  let context = null

  onMount(() => {
    context = _bb.getContext("BBMD:input:context")

    if (!!checkbox) {
      instance = new MDCCheckbox(checkbox)
      instance.indeterminate = indeterminate
      if (context !== "list-item") {
        //TODO: Fix this connected to Formfield context issue
        // let fieldStore = _bb.getContext("BBMD:field-element")
        // fieldStore.setInput(instance)
      }
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
</script>

<!-- TODO: Customizing Colour and Density - What level of customization for these things does Budibase need here? -->

{#if context !== 'list-item'}
  <Formfield {label} {id} {alignEnd}>
    <div bind:this={checkbox} class={blockClass}>
      <input
        type="checkbox"
        class={cb.elem`native-control`}
        {id}
        {disabled}
        {checked}
        on:click={onClick} />
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
{:else}
  <div bind:this={checkbox} class={blockClass}>
    <input
      type="checkbox"
      class={cb.elem`native-control`}
      {id}
      {disabled}
      {checked}
      on:click={onClick} />
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
