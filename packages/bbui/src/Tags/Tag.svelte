<script lang="ts">
  import "@spectrum-css/tags/dist/index-vars.css"
  import Avatar from "../Avatar/Avatar.svelte"
  import ClearButton from "../ClearButton/ClearButton.svelte"
  import Icon from "../Icon/Icon.svelte"

  export let icon: string = ""
  export let avatar: string = ""
  export let invalid: boolean = false
  export let disabled: boolean = false
  export let closable: boolean = false
  export let emphasized: boolean = false
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
    <Icon name={icon} size="S" />
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
    gap: 3px;
    border-radius: 8px;
  }

  .is-emphasized {
    background-color: rgba(75, 117, 255, 0.2);
    border: 0.5px solid rgba(75, 117, 255, 0.2);
    border-radius: 6px;
    padding: 1px 3px;
    color: var(--spectrum-global-color-gray-900);
  }
</style>
