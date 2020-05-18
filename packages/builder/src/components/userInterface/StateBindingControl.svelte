<script>
  import { backendUiStore } from "builderStore"
  import IconButton from "../common/IconButton.svelte"
  import Input from "../common/Input.svelte"
  import PropertyCascader from "./PropertyCascader"
  import { isBinding, getBinding, setBinding } from "../common/binding"
  import Colorpicker from "../common/Colorpicker.svelte"

  export let value = ""
  export let onChanged = () => {}
  export let type = ""
  export let options = []
  export let styleBindingProperty = ""

  $: bindOptionToStyle = !!styleBindingProperty
</script>

<div class="unbound-container">
  {#if type === 'bool'}
    <div>
      <IconButton
        icon={value == true ? 'check-square' : 'square'}
        size="19"
        on:click={() => onChanged(!value)} />
    </div>
  {:else if type === 'models'}
    <select
      class="uk-select uk-form-small"
      bind:value
      on:change={() => {
        onChanged(value)
      }}>
      {#each $backendUiStore.models || [] as option}
        <option value={option}>{option.name}</option>
      {/each}
    </select>
  {:else if type === 'options' || type === 'models'}
    <select
      class="uk-select uk-form-small"
      {value}
      on:change={ev => onChanged(ev.target.value)}>
      {#each options || [] as option}
        {#if bindOptionToStyle}
          <option style={`${styleBindingProperty}: ${option};`} value={option}>
            {option}
          </option>
        {:else}
          <option value={option}>{option}</option>
        {/if}
      {/each}
    </select>
  {:else if type === 'colour'}
    <Colorpicker {onChanged} {value} />
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
