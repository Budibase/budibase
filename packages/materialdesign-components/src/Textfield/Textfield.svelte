<script>
  import { setContext, onMount } from "svelte"
  import { MDCTextField } from "@material/textfield"
  import { MDCLineRipple } from "@material/line-ripple"

  import ClassBuilder from "../ClassBuilder.js"
  import NotchedOutline from "../Common/NotchedOutline.svelte"
  import FloatingLabel from "../Common/FloatingLabel.svelte"
  import Icon from "../Icon.svelte"

  const cb = new ClassBuilder("text-field", ["primary", "medium"])

  let tf = null
  let tfInstance = null

  onMount(() => {
    if (!!tf) tfInstance = new MDCTextField(tf)
    return () => {
      !!tfInstance && tf.tfInstance.destroy()
      tf = null
    }
  })

  export let label = ""
  export let variant = "standard" //outlined | filled | standard
  export let disabled = false
  export let fullwidth = false
  export let colour = "primary"
  export let size = "medium"
  export let type = "text" //text or password
  export let required = false
  export let minLength = 0
  export let maxLength = 100
  export let useCharCounter = false
  export let helperText = ""
  export let errorText = ""
  export let placeholder = ""
  export let icon = ""
  export let trailingIcon = false
  export let textarea = false
  export let rows = 4
  export let cols = 40
  export let validation = false
  export let persistent = false

  let id = `${label}-${variant}`

  let modifiers = { fullwidth, disabled, textarea }
  let customs = { colour }

  if (variant == "standard" || fullwidth) {
    customs = { ...customs, variant }
  } else {
    modifiers = { ...modifiers, variant }
  }

  if (!textarea && size !== "medium") {
    customs = { ...customs, size }
  }

  if (!label || fullwidth) {
    modifiers = { ...modifiers, noLabel: "no-label" }
  }

  let helperClasses = cb.debase(`${cb.block}-helper-text`, {
    modifiers: { persistent, validation },
  })

  let useLabel = !!label && (!fullwidth || (fullwidth && textarea))
  let useIcon = !!icon && (!textarea && !fullwidth)

  $: useNotchedOutline = variant == "outlined" || textarea

  if (useIcon) {
    setContext("BBMD:icon:context", "text-field")
    let iconClass = trailingIcon ? "with-trailing-icon" : "with-leading-icon"
    modifiers = { ...modifiers, iconClass }
  }

  $: renderLeadingIcon = useIcon && !trailingIcon
  $: renderTrailingIcon = useIcon && trailingIcon

  let props = { modifiers, customs }
  const blockClasses = cb.build({ props })
  const inputClasses = cb.elem("input")

  let renderMaxLength = !!maxLength ? `0 / ${maxLength}` : "0"

  function focus(event) {
    tfInstance.focus()
  }
</script>

<!-- 
TODO:Needs error handling - this will depend on how Budibase handles errors
 -->

<div class="textfield-container" class:fullwidth>
  <div bind:this={tf} class={blockClasses}>
    {#if textarea}
      {#if useCharCounter}
        <div class="mdc-text-field-character-counter">{renderMaxLength}</div>
      {/if}
      <textarea
        {id}
        class={inputClasses}
        class:fullwidth
        {disabled}
        {rows}
        {cols}
        {required}
        {placeholder}
        {minLength}
        {maxLength}
        on:change />
    {:else}
      {#if renderLeadingIcon}
        <Icon {icon} />
      {/if}
      <input
        {id}
        {disabled}
        on:focus={focus}
        class={inputClasses}
        {type}
        {required}
        placeholder={!!label && fullwidth ? label : placeholder}
        {minLength}
        {maxLength}
        aria-label={`Textfield ${variant}`}
        on:change />
      {#if renderTrailingIcon}
        <Icon {icon} />
      {/if}
      {#if variant !== 'outlined'}
        <div class="mdc-line-ripple" />
      {/if}
    {/if}
    {#if useNotchedOutline}
      <NotchedOutline {useLabel}>
        {#if useLabel}
          <FloatingLabel forInput={id} text={label} />
        {/if}
      </NotchedOutline>
    {:else if useLabel}
      <FloatingLabel forInput={id} text={label} />
    {/if}
  </div>
  <!-- TODO: Split to own component? -->
  <div class="mdc-text-field-helper-line">
    <div class={helperClasses}>{!!errorText ? errorText : helperText}</div>
    {#if useCharCounter && !textarea}
      <div class="mdc-text-field-character-counter">{renderMaxLength}</div>
    {/if}
  </div>
</div>

<style>
  .textfield-container {
    padding: 8px;
    display: flex;
    flex-direction: column;
    width: 227px;
  }

  .fullwidth {
    width: 100%;
  }
</style>
