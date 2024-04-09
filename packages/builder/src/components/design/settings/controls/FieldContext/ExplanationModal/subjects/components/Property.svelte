<script>
  export let name;
  export let value;
  export let pre;
</script>

<div class="property">
  
{#if pre}
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
  padding: 4px;
  border-radius: 3px;
  width: 250px;
  background-color: black;
}
</style>
