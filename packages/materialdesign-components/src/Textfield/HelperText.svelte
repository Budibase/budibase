<script>
  import ClassBuilder from "../ClassBuilder.js"
  import CharacterCounter from "./CharacterCounter.svelte"

  export let persistent = false
  export let validation = false
  export let useCharCounter = false
  export let errorText = ""
  export let helperText = ""

  const cb = new ClassBuilder("text-field-helper-text")

  let modifiers = { persistent, validation }
  let props = { modifiers }

  let helperClasses = cb.build({ props })
</script>

<div class="mdc-text-field-helper-line">
  <div class={helperClasses}>{!!errorText ? errorText : helperText}</div>
  {#if useCharCounter}
    <CharacterCounter />
  {/if}
</div>
