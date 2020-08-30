<script>
  import { store } from "builderStore"
  import deepmerge from "deepmerge"
  import { Label } from "@budibase/bbui"

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
  <Label size="s" forAttr={'page'}>Page</Label>
  <div class="uk-form-controls">
    <select class="budibase__input" bind:value={pageName}>
      {#each Object.keys(pages) as page}
        <option value={page}>{page}</option>
      {/each}
    </select>
  </div>
  {#if components.length > 0}
    <Label size="s" forAttr={'component'}>Component</Label>
    <div class="uk-form-controls">
      <select class="budibase__input" bind:value>
        {#each components as component}
          <option value={component._id}>{component._id}</option>
        {/each}
      </select>
    </div>
  {/if}
</div>
