<script>
  import { setContext, onMount } from "svelte"
  import { MDCTextField } from "@material/textfield"
  import { MDCLineRipple } from "@material/line-ripple"

  import ClassBuilder from "../ClassBuilder.js"
  import NotchedOutline from "../Common/NotchedOutline.svelte"
  import FloatingLabel from "../Common/FloatingLabel.svelte"
  import HelperText from "./HelperText.svelte"
  import CharacterCounter from "./CharacterCounter.svelte"
  import Icon from "../Common/Icon.svelte"
  import { IconButton } from "../IconButton"

  const cb = new ClassBuilder("text-field", ["primary", "medium"])

  let tf = null
  export let tfHeight = null
  $: console.log("TF", tfHeight)
  let tfInstance = null

  onMount(() => {
    if (!!tf) tfInstance = new MDCTextField(tf)
    return () => {
      !!tfInstance && tf.tfInstance && tf.tfInstance.destroy()
      tf = null
    }
  })

  export let onChange = text => {}

  export let label = ""
  export let variant = "standard" //outlined | filled | standard
  export let disabled = false
  export let fullwidth = false
  export let colour = "primary"
  export let size = "medium"
  export let type = "text" //text or password
  export let required = false
  export let minLength = null
  export let maxLength = null
  export let helperText = ""
  export let errorText = ""
  export let placeholder = ""
  export let icon = ""
  export let trailingIcon = false
  export let useIconButton = false
  export let iconButtonClick = () => {}
  export let textarea = false
  export let rows = 4
  export let cols = 40
  export let validation = false
  export let persistent = false
  export let value
  export let _bb

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

  let useLabel = !!label && (!fullwidth || (fullwidth && textarea))
  let useIcon = !!icon && !textarea && !fullwidth

  if (useIcon) {
    let iconClass = trailingIcon ? "with-trailing-icon" : "with-leading-icon"
    modifiers = { ...modifiers, iconClass }
  }

  $: useNotchedOutline = variant == "outlined" || textarea
  $: renderLeadingIcon = useIcon && !trailingIcon
  $: renderTrailingIcon = useIcon && trailingIcon
  $: safeMaxLength = maxLength <= 0 ? undefined : maxLength

  let props = { modifiers, customs }
  const blockClasses = cb.build({ props })
  const inputClasses = cb.elem("input")

  let renderMaxLength = !!maxLength ? `0 / ${maxLength}` : "0"

  function focus(event) {
    tfInstance.focus()
  }

  function changed(e) {
    const val = e.target.value
    value = val
    if (_bb.isBound(_bb.props.value)) {
      _bb.setStateFromBinding(_bb.props.value, val)
    }
    _bb.call(onChange, val)
  }
</script>

<!-- 
TODO:Needs error handling - this will depend on how Budibase handles errors
 -->

<div class="textfield-container" class:fullwidth>
  <div bind:this={tf} bind:clientHeight={tfHeight} class={blockClasses}>
    {#if textarea}
      <CharacterCounter />
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
        maxLength={safeMaxLength}
        {value}
        on:change={changed} />
    {:else}
      {#if renderLeadingIcon}
        {#if useIconButton}
          <IconButton
            {icon}
            context="mdc-text-field__icon mdc-text-field__icon--leading"
            onClick={iconButtonClick} />
        {:else}
          <Icon context="text-field" {icon} />
        {/if}
      {/if}
      <input
        {id}
        {disabled}
        class={inputClasses}
        {type}
        {required}
        placeholder={!!label && fullwidth ? label : placeholder}
        {minLength}
        maxLength={safeMaxLength}
        {value}
        aria-label={`Textfield ${variant}`}
        on:focus={focus}
        on:input={changed} />
      {#if renderTrailingIcon}
        {#if useIconButton}
          <IconButton
            {icon}
            context="mdc-text-field__icon mdc-text-field__icon--trailing"
            onClick={iconButtonClick} />
        {:else}
          <Icon context="text-field" {icon} />
        {/if}
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
  <HelperText
    {persistent}
    {validation}
    {errorText}
    {helperText}
    useCharCounter={!!maxLength && !textarea} />
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
