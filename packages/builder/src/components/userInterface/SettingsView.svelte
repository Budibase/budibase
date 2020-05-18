<script>
  import PropertyControl from "./PropertyControl.svelte"
  import InputGroup from "../common/Inputs/InputGroup.svelte"
  import { excludeProps } from "./propertyCategories.js"

  export let panelDefinition = {}
  export let componentInstance = {}
  export let onChange = () => {}

  function handleChange(key, data) {
    data.target ? onChange(key, data.target.value) : onChange(key, data)
  }

  const meta = [
    { placeholder: "T" },
    { placeholder: "R" },
    { placeholder: "B" },
    { placeholder: "L" },
  ]

  $: settingsControls = !!panelDefinition ? Object.entries(panelDefinition) : []
</script>

<h4>Settings Panel</h4>

<InputGroup label="Testing" {meta} />

{#each settingsControls as [key, definition]}
  <PropertyControl
    control={definition.control}
    label={key}
    value={componentInstance[key]}
    onChange={value => handleChange(key, value)}
    props={{ ...excludeProps(definition, ['control']) }} />
{/each}
