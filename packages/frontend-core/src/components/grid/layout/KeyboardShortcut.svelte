<script>
  export let keybind
  export let padded = false
  export let overlay = false

  $: parsedKeys = parseKeys(keybind)

  const parseKeys = keybind => {
    return keybind?.split("+").map(key => {
      if (key.toLowerCase() === "ctrl") {
        return navigator.platform.startsWith("Mac") ? "⌘" : key
      } else if (key.toLowerCase() === "enter") {
        return "↵"
      }
      return key
    })
  }
</script>

<div class="keys" class:padded class:overlay>
  {#each parsedKeys as key}
    <div class="key">
      {key}
    </div>
  {/each}
</div>

<style>
  .keys {
    display: flex;
    flex-direction: row;
    gap: 3px;
  }
  .keys.padded {
    padding: var(--cell-padding);
  }
  .key {
    padding: 2px 6px;
    font-size: 12px;
    font-weight: 600;
    background-color: var(--spectrum-global-color-gray-300);
    color: var(--spectrum-global-color-gray-700);
    border-radius: 4px;
    text-align: center;
    display: grid;
    place-items: center;
    text-transform: uppercase;
  }
  .overlay .key {
    background: rgba(255, 255, 255, 0.2);
    color: #eee;
  }
</style>
