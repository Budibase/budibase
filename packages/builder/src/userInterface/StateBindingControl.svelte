<script>
  import IconButton from "../common/IconButton.svelte"
  import Input from "../common/Input.svelte"
  import PropertyCascader from "./PropertyCascader.svelte"
  import { isBinding, getBinding, setBinding } from "../common/binding"

  export let value = ""
  export let onChanged = () => {}
  export let type = ""
  export let options = []
</script>

<div class="unbound-container">
  {#if type === 'bool'}
    <div>
      <IconButton
        icon={value == true ? 'check-square' : 'square'}
        size="19"
        on:click={() => onChanged(!value)} />
    </div>
  {:else if type === 'options'}
    <select
      class="uk-select uk-form-small"
      {value}
      on:change={ev => onChanged(ev.target.value)}>
      {#each options as option}
        <option value={option}>{option}</option>
      {/each}
    </select>
  {:else}
    <PropertyCascader {onChanged} {value} />
  {/if}
</div>

<style>
  .unbound-container {
    display: flex;
  }

  .bound-header > div:nth-child(1) {
    flex: 1 0 auto;
    width: 30px;
    color: var(--secondary50);
    padding-left: 5px;
  }
</style>
