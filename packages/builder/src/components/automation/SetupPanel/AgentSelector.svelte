<script>
  import { Select } from "@budibase/bbui"
  import { createEventDispatcher, onMount } from "svelte"
  import { agentsStore } from "@/stores/portal"
  import PropField from "./PropField.svelte"

  const dispatch = createEventDispatcher()

  export let value
  export let title

  const onChangeAgent = e => {
    dispatch("change", e.detail)
  }

  $: agents = $agentsStore.agents

  onMount(async () => {
    if (!$agentsStore.agentsLoaded) {
      await agentsStore.fetchAgents()
    }
  })
</script>

<div class="selector">
  <PropField label={title} fullWidth>
    <Select
      on:change={onChangeAgent}
      {value}
      options={agents}
      getOptionValue={agent => agent._id}
      getOptionLabel={agent => agent.name}
      placeholder="Select an agent"
    />
  </PropField>
</div>
