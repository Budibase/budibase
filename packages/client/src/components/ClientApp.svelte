<script>
  import { setContext } from "svelte"
  import Component from "./Component.svelte"
  import SDK from "../sdk"

  // Provide SDK for components
  setContext("app", SDK)

  const frontendDefinition = window["##BUDIBASE_FRONTEND_DEFINITION##"]
  $: pageDefinition = frontendDefinition?.page?.props
  $: console.log(frontendDefinition)
</script>

<Component definition={pageDefinition} />
