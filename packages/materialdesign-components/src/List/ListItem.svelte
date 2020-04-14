<script>
  import { onMount, getContext } from "svelte"
  import { Radiobutton } from "../Radiobutton"
  import { Checkbox } from "../Checkbox"
  import Icon from "../Common/Icon.svelte"
  import ClassBuilder from "../ClassBuilder.js"
  import { generate } from "shortid"

  const cb = new ClassBuilder("list-item")

  let _id
  let listProps = null

  let selectedItems

  export let _bb

  export let value = ""
  export let text = ""
  export let secondaryText = ""

  export let leadingIcon = ""
  export let trailingIcon = ""
  export let selected = false
  export let disabled = false
  export let dividerAfter = false

  let role = "option"

  const itemData = () => ({
    _id,
    value,
    text,
    secondaryText,
    selected,
    disabled,
  })

  onMount(() => {
    _id = generate()

    selectedItems = _bb.getContext("BBMD:list:selectItemStore")

    listProps = _bb.getContext("BBMD:list:props")

    let context = _bb.getContext("BBMD:list:context")
    const _addItem = _bb.getContext("BBMD:list:addItem")

    if (context === "menu") {
      role = "menuitem"
    }

    // TODO: Causing first element to be automatically selected. Commenting for now.
    // if (_addItem) {
    //   _addItem(itemData())
    // }
  })

  function handleChange() {
    let item = itemData()
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
    ($selectedItems && selectedItems.getItemIdx($selectedItems, _id) > -1) ||
    selected

  $: modifiers = {
    selected: isSelected && (!listProps || !listProps.inputElement),
    disabled,
  }
  $: props = { modifiers }
  $: listItemClass = cb.build({ props })

  $: useTwoLine =
    listProps && listProps.variant === "two-line" && !!secondaryText

  $: hasInputElement = listProps && listProps.inputElement !== "None"
</script>

<li
  class={listItemClass}
  role="option"
  tabindex="0"
  on:click={handleChange}
  data-value={value || text}
  aria-selected={isSelected}>
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

  {#if hasInputElement}
    {#if listProps.inputElement === 'Radiobutton'}
      <Radiobutton checked={isSelected} {disabled} {_bb} />
    {:else if listProps.inputElement === 'Checkbox'}
      <Checkbox checked={isSelected} {disabled} {_bb} />
    {/if}
  {:else if !!trailingIcon}
    <Icon context="list-item__meta" icon={trailingIcon} />
  {/if}
</li>
{#if dividerAfter}
  <li class="mdc-list-divider" role="separator" />
{/if}
