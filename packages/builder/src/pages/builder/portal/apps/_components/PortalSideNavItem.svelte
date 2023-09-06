<script>
  import { Icon } from "@budibase/bbui"
  import { goto } from "@roxi/routify"

  export let icon = null
  export let iconColor = null
  export let text = ""
  export let selected = false
  export let url = null
</script>

<div class="container" on:click={() => $goto(url)} class:selected>
  <Icon name={icon} color={iconColor} />
  <div class="text">{text}</div>
</div>

<style>
  .container {
    padding: 8px 12px;
    border-radius: var(--spacing-s);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--spacing-l);
    transition: background 130ms ease-out;
  }
  .container:hover {
    background: var(--spectrum-global-color-gray-200);
    cursor: pointer;
  }
  .container.selected {
    background: var(--spectrum-global-color-gray-300);
  }
  .container :global(.spectrum-Icon) {
    color: var(--spectrm-global-color-gray-600);
  }
  .text {
    flex: 1 1 auto;
    font-size: 14px;
    color: var(--spectrm-global-color-gray-900);
  }
</style>
