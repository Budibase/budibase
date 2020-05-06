<script>
  import { onMount } from "svelte";
  // import { cssVars, createClasses } from "./cssVars"
  // import { buildStyle } from "./buildStyle"

  export let _bb
  export let onLoad
  export let _instanceId
  export let model

  let cssVariables
  let headers = []
  let data = []

  async function fetchData() {
    const FETCH_RECORDS_URL = `/api/${_instanceId}/${model}/records`;
    const response = await _bb.api.get(FETCH_RECORDS_URL);
    if (response.status === 200) {
      const json = await response.json();

      data = json;
      headers = Object.keys(data[0]).filter(key => !key.startsWith("_"));
    } else {
      throw new Error("Failed to fetch records.", response);
    }
  }

  onMount(async () => {
    await fetchData();
  })
</script>

<!-- This prop was in the old one -->
<!-- use:cssVars={cssVariables} -->

<table class="uk-table">
  <thead>
    <tr>
      {#each headers as header}
        <th>{header}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each data as row}
      <tr>
      {#each headers as header}
        {#if row[header]}
          <td>
            {row[header]}
          </td>
        {/if}
      {/each}
      </tr>
    {/each}
  </tbody>
</table>


<!-- <button
  bind:this={theButton}
  use:cssVars={cssVariables}
  class="{className}
  {customClasses}"
  disabled={disabled || false}
  on:click={clickHandler}
  style={buttonStyles}>
  {#if !_bb.props._children || _bb.props._children.length === 0}
    {contentText}
  {/if}
</button> -->

<style>
  table {
    border: 1px solid #ccc;
    background: #fff;
    border-radius: 3px;
    border-collapse: collapse;
  }

  thead {
    background: #f9f9f9;
    border: 1px solid #ccc;
  }

  thead th {
    color: var(--button-text);
    text-transform: capitalize;
    font-weight: 500;
    font-size: 14px;
    text-rendering: optimizeLegibility;
    letter-spacing: 1px;
  }

  tbody tr {
    border-bottom: 1px solid #ccc;
    transition: 0.3s background-color;
    color: var(--secondary100);
    font-size: 14px;
  }

  tbody tr:hover {
    background: #fafafa;
  }
</style>
