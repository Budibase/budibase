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
  let componentDef;
  $: {
    componentDef = 
      component && components &&
      components.find(({ name }) => name === component._component)
    console.log(componentDef.props)
  }

  let setProp = (name, value) => {
    onPropChanged(name, value)
  }

</script>

<div class="root">

  <form class="uk-form-stacked form-root">
    {#if componentDef}
    {#each Object.entries(componentDef.props) as [prop_name, prop_def], index}
      <div class="prop-container">

        <PropControl
          {setProp}
          {prop_name}
          prop_value={component[prop_name]}
          prop_type={prop_def.type}
          {index}
          disabled={false} />

      </div>
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
