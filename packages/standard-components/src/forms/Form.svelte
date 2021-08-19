<script>
  import { getContext } from "svelte"
  import InnerForm from "./InnerForm.svelte"

  export let dataSource
  export let theme
  export let size
  export let disabled = false
  export let actionType = "Create"

  const context = getContext("context")

  // Returns the closes data context which isn't a built in context
  const getInitialValues = (type, dataSource, context) => {
    // Only inherit values for update forms
    if (type !== "Update") {
      return {}
    }
    // Only inherit values for forms targeting internal tables
    if (!dataSource?.tableId) {
      return {}
    }
    // Don't inherit values representing built in contexts
    if (["user", "url"].includes(context.closestComponentId)) {
      return {}
    }
    // Always inherit the closest data source
    const closestContext = context[`${context.closestComponentId}`] || {}
    return closestContext || {}
  }

  $: initialValues = getInitialValues(actionType, dataSource, $context)
  $: resetKey = JSON.stringify(initialValues)
</script>

{#key resetKey}
  <InnerForm
    {dataSource}
    {theme}
    {size}
    {disabled}
    {actionType}
    {initialValues}
  >
    <slot />
  </InnerForm>
{/key}
