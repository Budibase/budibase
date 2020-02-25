<script>
  import { onMount, getContext } from "svelte"
  import { Radiobutton } from "../Radiobutton"
  import { Checkbox } from "../Checkbox"
  import ClassBuilder from "../ClassBuilder.js"

  const cb = new ClassBuilder("list-item")

  export let onClick = item => {}

  export let text = ""
  export let secondaryText = ""
  export let variant = "two-line"
  export let inputElement = null
  export let leadingIcon = ""
  export let trailingIcon = ""
  export let selected = false
  export let disabled = false

  let role = "option"

  onMount(() => {
    let context = getContext("BBMD:list:context")
    if (context === "menu") {
      role = "menuitem"
    }
  })

  $: if (!!inputElement) {
    setContext("BBMD:input:context", "list-item")
  }

  $: modifiers = {
    selected,
    disabled,
  }
  $: props = { modifiers }
  $: listItemClass = cb.build({ props })

  $: useTwoLine = variant === "two-line" && !!secondaryText
</script>

<li
  class={listItemClass}
  role="option"
  aria-selected={selected}
  tabindex="0"
  on:click={onClick}>
  {#if leadingIcon}
    <span class="mdc-list-item__graphic material-icons" aria-hidden="true">
      {leadingIcon}
    </span>
  {/if}
  <span class={cb.elem`text`}>
    {#if useTwoLine}
      <span class={cb.elem`primary-text`}>{text}</span>
      <span class={cb.elem`secondary-text`}>{secondaryText}</span>
    {:else}{text}{/if}
  </span>

  {#if inputElement}
    {#if inputElement === 'radiobutton'}
      <Radiobutton checked={selected} {disabled} />
    {:else if inputElement === 'checkbox'}
      <Checkbox checked={selected} {disabled} />
    {/if}
  {:else if trailingIcon}
    <!-- TODO: Adapt label to accept class prop to handle this. Context is insufficient -->
    <span class="mdc-list-item__meta material-icons" aria-hidden="true">
      {trailingIcon}
    </span>
  {/if}
</li>
