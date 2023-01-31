<script>
  import { Button, FancyForm, FancyInput, FancyCheckbox } from "@budibase/bbui"
  import { capitalise } from "helpers/helpers"
  import PanelHeader from "./PanelHeader.svelte"

  export let title = ""
  export let onBack = null
  export let onNext = () => {}
  export let fields = {}

  let errors = {}

  const formatName = name => {
    if (name === "ca") {
      return "CA"
    }

    if (name === "ssl") {
      return "SSL"
    }

    if (name === "rejectUnauthorized") {
      return "Reject Unauthorized"
    }

    return capitalise(name)
  }

  const getDefaultValues = fields => {
    const newValues = {}

    Object.entries(fields).forEach(([name, { default: defaultValue }]) => {
      if (defaultValue) {
        newValues[name] = defaultValue
      }
    })

    return newValues
  }

  const values = getDefaultValues(fields)

  const validateRequired = value => {
    if (value.length < 1) {
      return "Required field"
    }
  }

  const getIsValid = (fields, errors, values) => {
    for (const [name, { required }] of Object.entries(fields)) {
      if (required && !values[name]) {
        return false
      }
    }

    return Object.values(errors).every(error => !error)
  }

  $: isValid = getIsValid(fields, errors, values)

  const handleNext = () => {
    const parsedValues = {}

    Object.entries(values).forEach(([name, value]) => {
      if (fields[name].type === "number") {
        parsedValues[name] = parseInt(value, 10)
      } else {
        parsedValues[name] = value
      }
    })

    return onNext(parsedValues)
  }
</script>

<div>
  <PanelHeader
    {title}
    subtitle="Fill in the required fields to fetch your tables"
    {onBack}
  />
  <div class="form">
    <FancyForm>
      {#each Object.entries(fields) as [name, { type, default: defaultValue, required }]}
        {#if type !== "boolean"}
          <FancyInput
            bind:value={values[name]}
            bind:error={errors[name]}
            validate={required ? validateRequired : () => {}}
            label={formatName(name)}
            {type}
          />
        {/if}
      {/each}
      {#each Object.entries(fields) as [name, { type, default: defaultValue, required }]}
        {#if type === "boolean"}
          <FancyCheckbox bind:value={values[name]} text={formatName(name)} />
        {/if}
      {/each}
    </FancyForm>
  </div>
  <Button cta disabled={!isValid} on:click={handleNext}>Connect</Button>
</div>

<style>
  .form {
    margin-bottom: 36px;
  }
</style>
