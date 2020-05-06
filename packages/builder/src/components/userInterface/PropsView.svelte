<script>
  import { some, includes, filter } from "lodash/fp"
  import Textbox from "../common/Textbox.svelte"
  import Dropdown from "../common/Dropdown.svelte"
  import PropControl from "./PropControl.svelte"
  import IconButton from "../common/IconButton.svelte"

  export let component
  export let onPropChanged = () => {}
  export let components

  let errors = []
  const props_to_ignore = ["_component", "_children", "_styles", "_code", "_id"]

  $: componentDef = components[component._component]

  let setProp = (name, value) => {
    onPropChanged(name, value)
  }
</script>

<div class="root">

  <form on:submit|preventDefault class="uk-form-stacked form-root">
    {#if componentDef}
      {#each Object.entries(componentDef.props) as [prop_name, prop_def], index}
        {#if prop_def !== "event"}
          <div class="prop-container">
            <PropControl
              {setProp}
              {prop_name}
              prop_value={component[prop_name]}
              prop_definition={prop_def}
              {index}
              disabled={false} />

          </div>
        {/if}
      {/each}
    {/if}
  </form>

</div>

<style>
  .root {
    font-size: 10pt;
    width: 100%;
  }

  .form-root {
    display: flex;
    flex-wrap: wrap;
  }

  .prop-container {
    flex: 1 1 auto;
    min-width: 250px;
  }
</style>
