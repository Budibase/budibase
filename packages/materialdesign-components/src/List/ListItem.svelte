<script>
  import { onMount } from "svelte"
  import { Radiobutton } from "../Radiobutton"
  import { Checkbox } from "../Checkbox"
  import ClassBuilder from "../ClassBuilder.js"
  import shortid from "shortid"

  const cb = new ClassBuilder("list-item")

  export let onClick = item => {}

  let _id
  let listProps = null

  export let _bb

  export let value = null
  export let text = ""
  export let secondaryText = ""

  export let leadingIcon = ""
  export let trailingIcon = ""
  export let selected = false
  export let disabled = false

  let role = "option"

  function handleClick() {
    if (!disabled) {
      const selectItem = _bb.getContext("BBMD:list:selectItem")
      selected = !selected
      selectItem({
        _id,
        value,
        text,
        secondaryText,
        selected,
        disabled,
      })
    }
  }

  onMount(() => {
    _id = shortid.generate()

    listProps = _bb.getContext("BBMD:list:props")

    let context = _bb.getContext("BBMD:list:context")
    if (context === "menu") {
      role = "menuitem"
    }
  })

  $: if (listProps && !!listProps.inputElement) {
    _bb.setContext("BBMD:input:context", "list-item")
  }

  $: shouldSel = selected && !listProps
  $: console.log("Should Select", selected)

  $: modifiers = {
    selected: selected && (!listProps || !listProps.inputElement),
    disabled,
  }
  $: props = { modifiers }
  $: listItemClass = cb.build({ props })

  $: useTwoLine =
    listProps && listProps.variant === "two-line" && !!secondaryText
</script>

<li class={listItemClass} role="option" tabindex="0" on:click={handleClick}>
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

  {#if listProps}
    {#if listProps.inputElement === 'radiobutton'}
      <Radiobutton checked={selected} {disabled} {_bb} />
    {:else if listProps.inputElement === 'checkbox'}
      <Checkbox checked={selected} {disabled} {_bb} />
    {/if}
  {:else if trailingIcon}
    <!-- TODO: Adapt label to accept class prop to handle this. Context is insufficient -->
    <span class="mdc-list-item__meta material-icons" aria-hidden="true">
      {trailingIcon}
    </span>
  {/if}
</li>
