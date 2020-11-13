<script>
  import { onMount } from "svelte"
  import { componentStore } from "../store"
  import Component from "./Component.svelte"
  import { getValidProps } from "../utils"

  let frontendDefinition
  let loaded = false
  $: pageProps = frontendDefinition?.page?.props

  onMount(async () => {
    frontendDefinition = window["##BUDIBASE_FRONTEND_DEFINITION##"]
    await componentStore.actions.loadComponentLibrary()
    loaded = true
    console.log(frontendDefinition)
  })
</script>

{#if loaded}
  <Component
    component={pageProps._component}
    props={getValidProps(pageProps)}
    children={pageProps._children}
    styles={pageProps._styles.normal} />
{/if}
