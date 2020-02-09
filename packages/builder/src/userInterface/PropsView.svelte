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
  let props = {}
  const props_to_ignore = ["_component", "_children", "_styles", "_code", "_id"]

  $: propDefs =
    component &&
    Object.entries(component).filter(
      ([name]) => !props_to_ignore.includes(name)
    )

  function find_type(prop_name) {
    if (!component._component) return
    return components.find(({ name }) => name === component._component).props[
      prop_name
    ]
  }

  let setProp = (name, value) => {
    onPropChanged(name, value)
  }

  const fieldHasError = propName => some(e => e.propName === propName)(errors)
</script>

<div class="root">

  <form class="uk-form-stacked form-root">
    {#each propDefs as [prop_name, prop_value], index}
      <div class="prop-container">

        <PropControl
          {setProp}
          {prop_name}
          {prop_value}
          prop_type={find_type(prop_name)}
          {index}
          disabled={false} />

      </div>
    {/each}

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
