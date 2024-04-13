<script>
  export let name;
  export let value;
  export let pre;
</script>

<div class="property">
  
{#if pre}
<span class="propertyName">
  {name}
</span>
  <span class="propertyDivider">-</span>
<pre class="pre propertyValue">
{value}
</pre>
{:else}
  <span class="propertyName">
    {name}
  </span>
  <span class="propertyDivider">-</span>
  <span class="propertyValue">
    {value}
  </span>
{/if}
</div>

<style>
  .propertyDivider {
    padding: 4px;
  }
  .propertyName {
    font-style: italic;
  }

  .pre {
    margin: 0;
    margin-top: 3px;
    padding: 4px;
    border-radius: 3px;
    width: 250px;
    box-sizing: border-box;
    background-color: black;
  }
</style>
