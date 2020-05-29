<script>
  import { onMount, beforeUpdate } from "svelte"
  import {buildStyle} from "../../helpers.js"
  export let options = []
  export let value = ""
  export let styleBindingProperty
  export let onChange = value => {}

  let open = null
  let rotate = ""
  let select
  let selectMenu
  let icon

  let selectYPosition = null
  let availableSpace = 0

  let positionSide = "top"
  let maxHeight = null
  let menuHeight

  const handleStyleBind = value =>
    !!styleBindingProperty ? { style: `${styleBindingProperty}: ${value}` } : {}

  onMount(() => {
    if (select) {
      select.addEventListener("keydown", addSelectKeyEvents)
    }
    return () => {
      select.removeEventListener("keydown", addSelectKeyEvents)
    }
  })

  function checkPosition() {
    const { bottom, top: spaceAbove } = select.getBoundingClientRect()
    const spaceBelow = window.innerHeight - bottom

    if (spaceAbove > spaceBelow) {
      positionSide = "bottom"
      maxHeight = `${spaceAbove.toFixed(0) - 20}px`
    } else {
      positionSide = "top"
      maxHeight = `${spaceBelow.toFixed(0) - 20}px`
    }
  }

  function addSelectKeyEvents(e) {
    if (e.key === "Enter") {
      if (!open) {
        toggleSelect(true)
      }
    } else if (e.key === "Escape") {
      if (open) {
        toggleSelect(false)
      }
    }
  }

  function toggleSelect(isOpen) {
    checkPosition()
    if (isOpen) {
      icon.style.transform = "rotate(180deg)"
    } else {
      icon.style.transform = "rotate(0deg)"
    }
    open = isOpen
  }

  function handleClick(val) {
    value = val
    onChange(value)
  }

  $: menuStyle = buildStyle({
    "max-height": maxHeight,
    "transform-origin": `center ${positionSide}`,
    [positionSide]: "32px",
  })

  $: isOptionsObject = options.every(o => typeof o === "object")

  $: selectedOption = isOptionsObject
    ? options.find(o => o.value === value)
    : {}

  $: displayLabel =
    selectedOption && selectedOption.label ? selectedOption.label : value || ""
</script>

<div
  tabindex="0"
  bind:this={select}
  class="bb-select-container"
  on:click={() => toggleSelect(!open)}>
  <div class="bb-select-anchor selected">
    <span>{displayLabel}</span>
    <i bind:this={icon} class="ri-arrow-down-s-fill" />
  </div>
  <div
    bind:this={selectMenu}
    style={menuStyle}
    class="bb-select-menu"
    class:open>
    <ul>
      {#if isOptionsObject}
        {#each options as { value: v, label }}
          <li
            {...handleStyleBind(v)}
            on:click|self={handleClick(v)}
            class:selected={value === v}>
            {label}
          </li>
        {/each}
      {:else}
        {#each options as v}
          <li
            {...handleStyleBind(v)}
            on:click|self={handleClick(v)}
            class:selected={value === v}>
            {v}
          </li>
        {/each}
      {/if}
    </ul>
  </div>
</div>
{#if open}
  <div on:click|self={() => toggleSelect(false)} class="overlay" />
{/if}

<style>
  .overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 1;
  }

  .bb-select-container {
    position: relative;
    outline: none;
    width: 189px;
    height: 32px;
    cursor: pointer;
  }

  .bb-select-anchor {
    cursor: pointer;
    display: flex;
    padding: 5px 10px;
    background-color: #f2f2f2;
    border-radius: 2px;
    border: 1px solid var(--grey-dark);
  }

  .bb-select-anchor > span {
    color: #565a66;
    font-weight: 500;
    width: 145px;
    overflow-x: hidden;
  }

  .bb-select-anchor > i {
    transition: transform 0.13s ease;
    transform-origin: center;
    width: 25px;
    height: 25px;
    text-align: center;
  }

  .selected {
    color: #565a66;
    font-weight: 500;
  }

  .bb-select-menu {
    position: absolute;
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    opacity: 0;
    width: 189px;
    z-index: 2;
    color: #808192;
    font-weight: 500;
    height: fit-content !important;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
    border-right: 1px solid var(--grey-dark);
    border-left: 1px solid var(--grey-dark);
    border-bottom: 1px solid var(--grey-dark);
    background-color: #f2f2f2;
    transform: scale(0);
    transition: opacity 0.13s linear, transform 0.12s cubic-bezier(0, 0, 0.2, 1);
    overflow-y: auto;
  }

  .open {
    transform: scale(1);
    opacity: 1;
  }

  ul {
    list-style-type: none;
    margin: 0;
    padding: 5px 0px;
  }

  li {
    height: auto;
    padding: 5px 0px;
    cursor: pointer;
    padding-left: 10px
  }

  li:hover {
    background-color:#e6e6e6
  }
</style>
