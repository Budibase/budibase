<script>
  import { DataList } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { store } from "builderStore"

  const dispatch = createEventDispatcher()

  export let value = ""

  const handleBlur = () => dispatch("change", value)
</script>

<DataList editable secondary on:blur={handleBlur} on:change bind:value>
  <option value="" />
  {#each $store.allScreens as screen}
    <option value={screen.route}>{screen.props._instanceName}</option>
  {/each}
</DataList>
