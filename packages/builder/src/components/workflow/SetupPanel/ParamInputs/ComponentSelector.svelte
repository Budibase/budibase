<script>
  import { store } from "builderStore"
  import deepmerge from "deepmerge"

  export let value

  let pages = []
  let components = []
  let pageName

  let selectedPage
  let selectedScreen

  $: pages = $store.pages
  $: selectedPage = pages[pageName]
  $: screens = selectedPage ? selectedPage._screens : []
  $: if (selectedPage) {
    let result = selectedPage
    for (screen of screens) {
      result = deepmerge(result, screen)
    }
    components = result.props._children
  }
</script>

<div class="bb-margin-xl block-field">
  <label class="uk-form-label">Page</label>

  <select class="budibase__input" bind:value={pageName}>
    {#each Object.keys(pages) as page}
      <option value={page}>{page}</option>
    {/each}
  </select>

  {#if components.length > 0}
    <label class="uk-form-label">Component</label>
    <select class="budibase__input" bind:value>
      {#each components as component}
        <option value={component._id}>{component._id}</option>
      {/each}
    </select>
  {/if}
</div>
