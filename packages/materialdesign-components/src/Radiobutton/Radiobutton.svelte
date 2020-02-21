<script>
  import { onMount, onDestroy, getContext } from "svelte"
  import Formfield from "../Common/Formfield.svelte"
  import ClassBuilder from "../ClassBuilder.js"
  import { MDCRadio } from "@material/radio"

  export let onClick = item => {}

  export let id = ""
  export let label = ""
  export let name = "radios"
  export let checked = false
  export let disabled = false
  export let alignEnd = false

  let instance = null
  let radiobtn = null

  let context = getContext("BBMD:input:context")

  onMount(() => {
    if (!!radiobtn) {
      instance = new MDCRadio(radiobtn)
      if (context !== "list-item") {
        let fieldStore = getContext("BBMD:field-element")
        fieldStore.setInput(instance)
      }
    }
  })

  let extras = null

  if (context === "list-item") {
    extras = ["mdc-list-item__meta"]
  }

  const cb = new ClassBuilder("radio")
  let modifiers = { disabled }
  let props = { modifiers, extras }

  const blockClass = cb.build({ props })
</script>

{#if context !== 'list-item'}
  <Formfield {id} {label} {alignEnd}>
    <div class={blockClass}>
      <input
        {id}
        class={cb.elem`native-control`}
        type="radio"
        {name}
        {checked}
        {disabled}
        on:click={onClick} />
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
      {disabled}
      on:click={onClick} />
    <div class={cb.elem`background`}>
      <div class={cb.elem`outer-circle`} />
      <div class={cb.elem`inner-circle`} />
    </div>
    <div class={cb.elem`ripple`} />
  </div>
{/if}
