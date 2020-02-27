<script>
  import { onMount, getContext } from "svelte"
  import { Radiobutton } from "../Radiobutton"
  import { Checkbox } from "../Checkbox"
  import ClassBuilder from "../ClassBuilder.js"
  import shortid from "shortid"

  const cb = new ClassBuilder("list-item")

  export let onClick = item => {}

  let _id
  let listProps = null

  let selectedItems

  export let _bb

  export let value = null
  export let text = ""
  export let secondaryText = ""

  export let leadingIcon = ""
  export let trailingIcon = ""
  export let selected = false
  export let disabled = false

  let role = "option"

  onMount(() => {
    _id = shortid.generate()

    selectedItems = _bb.getContext("BBMD:list:selectItemStore")

    listProps = _bb.getContext("BBMD:list:props")

    let context = _bb.getContext("BBMD:list:context")
    if (context === "menu") {
      role = "menuitem"
    }
  })

  function handleClick() {
    let item = {
      _id,
      value,
      text,
      secondaryText,
      selected,
      disabled,
    }
    if (!disabled) {
      if (
        listProps.singleSelection ||
        listProps.inputElement === "radiobutton"
      ) {
        selectedItems.addSingleItem(item)
      } else {
        let idx = selectedItems.getItemIdx($selectedItems, _id)
        if (idx > -1) {
          selectedItems.removeItem(_id)
        } else {
          selectedItems.addItem(item)
        }
      }
    }
  }

  $: if (listProps && !!listProps.inputElement) {
    _bb.setContext("BBMD:input:context", "list-item")
  }

  $: isSelected =
    $selectedItems && selectedItems.getItemIdx($selectedItems, _id) > -1

  $: modifiers = {
    selected: isSelected && (!listProps || !listProps.inputElement),
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
      <Radiobutton checked={isSelected} {disabled} {_bb} />
    {:else if listProps.inputElement === 'checkbox'}
      <Checkbox checked={isSelected} {disabled} {_bb} />
    {/if}
  {:else if trailingIcon}
    <!-- TODO: Adapt label to accept class prop to handle this. Context is insufficient -->
    <span class="mdc-list-item__meta material-icons" aria-hidden="true">
      {trailingIcon}
    </span>
  {/if}
</li>
