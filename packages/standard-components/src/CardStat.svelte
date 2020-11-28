<script>
  import { cssVars, createClasses } from "./cssVars"

  export const className = ""
  export let title = ""
  export let value = ""
  export let label = ""
  export let bordercolor = ""
  export let color

  $: cssVariables = {
    bordercolor,
    color,
  }
</script>

<div use:cssVars={cssVariables} class="container">
  <p class="title">{title}</p>
  <h3 class="value">{value}</h3>
  <p class="label">{label}</p>
</div>

<style>
  .container {
    min-width: 260px;
    width: max-content;
    max-height: 170px;
    border: 1px solid var(--bordercolor);
    border-radius: 0.3rem;
  }

  .title {
    font-size: 0.85rem;
    color: #9e9e9e;
    font-weight: 500;
    margin: 1rem 1.5rem 0.5rem 1.5rem;
  }

  .value {
    font-size: 2rem;
    font-weight: 500;
    color: var(--color);
    margin: 0rem 1.5rem 1.5rem 1.5rem;
  }

  .label {
    font-size: 0.85rem;
    font-weight: 400;
    color: #9e9e9e;
    margin: 1rem 1.5rem;
  }
</style>
