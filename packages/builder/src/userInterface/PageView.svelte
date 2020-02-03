<script>
  import Textbox from "../common/Textbox.svelte"
  import Dropdown from "../common/Dropdown.svelte"
  import Button from "../common/Button.svelte"
  import { store } from "../builderStore"
  import { isRootComponent } from "./pagesParsing/searchComponents"
  import { pipe } from "../common/core"
  import { filter, find, concat } from "lodash/fp"

  const notSeletedComponent = { name: "(none selected)" }

  $: page = $store.pages[$store.currentPageName]
  $: title = page.index.title
  $: components = pipe($store.components, [
    filter(store => !isRootComponent($store)),
    concat([notSeletedComponent]),
  ])
  $: entryComponent =
    find(c => c.name === page.appBody)(components) || notSeletedComponent

  const save = () => {
    if (!title || !entryComponent || entryComponent === notSeletedComponent)
      return
    const page = {
      index: {
        title,
      },
      appBody: entryComponent.name,
    }
    store.savePage(page)
  }
</script>

<div class="root">

  <h3>{$store.currentPageName}</h3>

  <form class="uk-form-horizontal">
    <Textbox bind:text={title} label="Title" hasError={!title} />
    <div class="help-text">
      The title of your page, displayed in the bowser tab
    </div>
    <Dropdown
      label="App Entry Component"
      options={components}
      bind:selected={entryComponent}
      textMember={v => v.name} />

    <div class="help-text">
      The component that will be loaded into the body of the page
    </div>
    <div style="margin-top: 20px" />
    <Button on:click={save}>Save</Button>
  </form>

</div>

<style>
  .root {
    padding: 15px;
  }
  .help-text {
    color: var(--slate);
    font-size: 10pt;
  }
</style>
