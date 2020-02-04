<script>
  import { setContext } from "svelte"
  import ClassBuilder from "../ClassBuilder.js"
  import NotchedOutline from "../Common/NotchedOutline.svelte"
  import FloatingLabel from "../Common/FloatingLabel.svelte"
  import Icon from "../Icon.svelte"

  const cb = new ClassBuilder("text-field")

  export let label = ""
  export let variant = "outlined" //outlined | filled | disabled
  export let type = "text" //text or password
  export let required = false
  export let minLength = 0
  export let maxLength = 100
  export let useCharCounter = true
  export let helperText = ""
  export let errorText = ""
  export let placeholder = ""
  export let icon = ""
  export let trailingIcon = false
  export let multiLine = false
  export let textArea = false
  export let rows = 8
  export let cols = 40

  /*   
NOTE: Do not use mdc-text-field--outlined to style a full width text field. 
How is this to be a worry if full-width is a variant?


NOTE: Do not use mdc-line-ripple inside of mdc-text-field if you plan on using mdc-text-field--outlined. Line Ripple should not be included as part of the DOM structure of an outlined text field.
*/

  //Does svelte make this unique in the same way it does classes?
  let id = `${label}-${variant}`

  let modifiers = [variant]
  if (!label) modifiers.push("no-label")

  const blockClasses = cb.blocks({ modifiers })
  const inputClasses = cb.elements("input")

  // NOTE: Do not use mdc-floating-label within mdc-text-field--fullwidth. Labels should not be included as part of the DOM structure of a full width text field.
  let useLabel = !!label && !variant !== "fullwidth"
  $: useNotchedOutline = variant !== "filled" || variant !== "fullwidth"

  $: if (icon) {
    setContext("BBMD:icon:context", "text-field")
  }

  $: renderLeadingIcon = !!icon && !trailingIcon
  $: renderTrailingIcon = !!icon && trailingIcon
</script>

<!-- 
TODO: Test multi-lining of textfields and implement in component
TODO: Implement line ripple
 -->

<div class={blockClasses}>
  {#if textArea}
    {#if useCharCounter}
      <div class="mdc-text-field-character-counter">{`0 / ${maxLength}`}</div>
    {/if}
    <textarea
      {id}
      class={inputClasses}
      {rows}
      {cols}
      {required}
      {placeholder}
      {minLength}
      {maxLength} />
  {:else}
    {#if renderLeadingIcon}
      <Icon {icon} />
    {/if}
    <input
      {id}
      class={inputClasses}
      {type}
      {required}
      {placeholder}
      {minLength}
      {maxLength}
      aria-label={`Textfield ${variant}`} />
    {#if renderTrailingIcon}
      <Icon {icon} />
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
<div class="mdc-text-field-helper-line">
  {#if useCharCounter && !textArea}
    <div class="mdc-text-field-character-counter">{`0 / ${maxLength}`}</div>
  {/if}
  <div class="mdc-text-field-helper-text">
    {!!errorText ? errorText : helperText}
  </div>
</div>
