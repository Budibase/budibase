<script>
  import "@spectrum-css/button/dist/index-vars.css"

  export let disabled = false

  /** @type {('S', 'M', 'L', 'XL')} Size of button */
  export let size = "M";

  // Types
  export let cta, primary, secondary, warning, overBackground;

  export let quiet = false
  
  export let icon = undefined;
</script>


<button
  class:spectrum-Button--cta={cta}
  class:spectrum-Button--primary={primary}
  class:spectrum-Button--secondary={secondary}
  class:spectrum-Button--warning={warning}
  class:spectrum-Button--overBackground={overBackground}
  class:spectrum-Button--quiet={quiet}
  class="spectrum-Button spectrum-Button--size{size.toUpperCase()}"
  {disabled}
  on:click|preventDefault>
  {#if icon}
    <svg class="spectrum-Icon spectrum-Icon--size{size.toUpperCase()}" focusable="false" aria-hidden="true" aria-label="{icon}">
      <use xlink:href="#spectrum-icon-18-{icon}" />
    </svg>
  {/if}
  {#if $$slots} 
    <span class="spectrum-Button-label"><slot /></span>
  {/if}
</button>

<style>

</style>
