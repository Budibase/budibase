<script lang="ts">
  import "@spectrum-css/tags/dist/index-vars.css"
  import Avatar from "../Avatar/Avatar.svelte"
  import ClearButton from "../ClearButton/ClearButton.svelte"

  export let icon: string = ""
  export let avatar: string = ""
  export let invalid: boolean = false
  export let disabled: boolean = false
  export let closable: boolean = false
  export let emphasized: boolean = false

  $: phosphorClass = `ph ph-${icon}`
</script>

<div
  class:is-invalid={invalid}
  class:is-disabled={disabled}
  class:is-emphasized={emphasized}
  class="spectrum-Tags-item"
  role="listitem"
>
  {#if avatar}
    <Avatar url={avatar} />
  {/if}
  {#if icon}
    <i
      class="{phosphorClass} spectrum-Icon spectrum-Icon--sizeS"
      style="font-size: 1rem; line-height: 1; vertical-align: middle;"
      aria-hidden="true"
      aria-label="Tag"
    />
  {/if}
  <span class="spectrum-Tags-itemLabel"><slot /></span>
  {#if closable}
    <ClearButton on:click />
  {/if}
</div>

<style>
  .spectrum-Tags-item {
    margin-bottom: 0;
    margin-top: 0;
  }

  .is-emphasized {
    border-color: var(--spectrum-global-color-blue-700);
    color: var(--spectrum-global-color-blue-700);
  }

  i {
    transition: color var(--spectrum-global-animation-duration-100, 130ms);
    pointer-events: none;
  }
</style>
