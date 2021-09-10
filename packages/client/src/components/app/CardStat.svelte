<script>
  import { getContext } from "svelte"

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  export const className = ""
  export let title = ""
  export let value = ""
  export let label = ""
</script>

<div use:styleable={$component.styles} class="container">
  <p class="title">{title}</p>
  <h3 class="value">{value}</h3>
  <p class="label">{label}</p>
</div>

<style>
  .container {
    min-width: 260px;
    width: max-content;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 0.3rem;
  }

  .title {
    font-size: 0.85rem;
    color: var(--spectrum-global-color-gray-600);
    font-weight: 600;
    margin: 1rem 1.5rem 0.5rem 1.5rem;
    white-space: pre-wrap;
  }

  .value {
    font-size: 2rem;
    font-weight: 600;
    margin: 0 1.5rem 1.5rem 1.5rem;
    color: var(--spectrum-link-primary-m-text-color);
    white-space: pre-wrap;
  }

  .label {
    font-size: 0.85rem;
    font-weight: 400;
    color: var(--spectrum-global-color-gray-600);
    margin: 1rem 1.5rem;
    white-space: pre-wrap;
  }
</style>
