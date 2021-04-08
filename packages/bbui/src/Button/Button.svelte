<script>
  import "@spectrum-css/button/dist/index-vars.css"



  export let href = false
  export let disabled = false

  /** @type {('S', 'M', 'L', 'XL')} Size of button */
  export let size = "M";
  /** @type {('cta','primary','secondary','warning', 'overBackground')} Type of button */
  export let type = "primary"
  
  export let icon = undefined;
</script>


{#if href}
  <a
    class="spectrum-Button spectrum-Button--{type} spectrum-Button--size{size.toUpperCase()}"
    {href}
    {disabled}>
    {#if icon}
      <svg class="spectrum-Icon spectrum-Icon--sizeS" focusable="false" aria-hidden="true" aria-label="{icon}">
        <use xlink:href="#spectrum-icon-18-{icon}" />
      </svg>
    {/if}
    <span class="spectrum-Button-label"><slot /></span>
  </a>
{:else}
  <button
    class="spectrum-Button spectrum-Button--{type} spectrum-Button--size{size.toUpperCase()}"
    {disabled}
    on:click|preventDefault>
    {#if icon}
      <svg class="spectrum-Icon spectrum-Icon--sizeM" focusable="false" aria-hidden="true" aria-label="{icon}">
        <use xlink:href="#spectrum-icon-18-{icon}" />
      </svg>
    {/if}
    <span class="spectrum-Button-label"><slot /></span>
  </button>
{/if}

<style>

</style>
