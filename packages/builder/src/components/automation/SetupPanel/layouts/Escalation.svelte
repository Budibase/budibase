<script lang="ts">
  import {
    type AutomationStep,
    type EnrichedBinding,
  } from "@budibase/types"

  import { PropField } from ".."
  import { automationStore } from "@/stores/builder"
  import { agentsStore } from "@/stores/portal"
  import { Select, Helpers } from "@budibase/bbui"
  import {
    DrawerBindableInput,
    ServerBindingPanel as AutomationBindingPanel,
  } from "@/components/common/bindings"
  import EscalationRecipients from "@/components/common/EscalationRecipients.svelte"
  import ExecuteScriptV2 from "../ExecuteScriptV2.svelte"

  export let block: AutomationStep | undefined = undefined
  export let bindings: EnrichedBinding[] | undefined = undefined
  export let context: {} | undefined

  type AgentOption = { _id: string; name: string }

  $: inputData = automationStore.actions.getInputData(block) as Record<
    string,
    any
  >
  $: schema = block?.schema.inputs?.properties || {}
  $: agents = ($agentsStore.agents ?? []) as AgentOption[]
  $: selectedAgentId = inputData?.agentId as string | undefined
  $: recipients = getRecipients(inputData)

  const getLabel = (key: string) => {
    const field = schema[key]
    return Helpers.capitalise(field?.title || key)
  }

  const handleChange = (key: string, value: unknown) => {
    if (!block) return
    automationStore.actions.requestUpdate({ [key]: value }, block)
  }

  const getRecipients = (data = inputData): any[] => {
    const notifications = data?.notifications
    if (!notifications) return []
    const parsed =
      typeof notifications === "string"
        ? JSON.parse(notifications)
        : notifications
    return parsed?.recipients ?? []
  }

  const setRecipients = (recipients: any[]) => {
    const current = inputData?.notifications ?? {}
    const parsed = typeof current === "string" ? JSON.parse(current) : current
    handleChange("notifications", { ...parsed, recipients })
  }
</script>

<div class="escalation-layout">
  <PropField label={getLabel("agentId")} fullWidth>
    <Select
      options={agents}
      value={selectedAgentId}
      getOptionLabel={(a: AgentOption) => a.name}
      getOptionValue={(a: AgentOption) => a._id}
      placeholder="Select agent..."
      on:change={e => handleChange("agentId", e.detail)}
    />
  </PropField>

  <PropField label={getLabel("operationId")} fullWidth>
    <DrawerBindableInput
      panel={AutomationBindingPanel}
      {bindings}
      {context}
      value={inputData?.operationId}
      updateOnChange={false}
      placeholder={schema.operationId?.description}
      on:change={e => handleChange("operationId", e.detail)}
    />
  </PropField>

  <PropField label={getLabel("message")} fullWidth>
    <DrawerBindableInput
      panel={AutomationBindingPanel}
      {bindings}
      {context}
      value={inputData?.message}
      updateOnChange={false}
      placeholder={schema.message?.description}
      on:change={e => handleChange("message", e.detail)}
    />
  </PropField>

  <PropField label={getLabel("delay")} fullWidth>
    <DrawerBindableInput
      panel={AutomationBindingPanel}
      {bindings}
      {context}
      value={inputData?.delay}
      updateOnChange={false}
      placeholder={schema.delay?.description}
      on:change={e => handleChange("delay", e.detail)}
    />
  </PropField>

  <PropField label="Recipients" fullWidth>
    <EscalationRecipients
      {recipients}
      agentId={selectedAgentId}
      onChange={setRecipients}
    />
  </PropField>

  <PropField label={getLabel("resolutionStrategy")} fullWidth>
    <ExecuteScriptV2
      {bindings}
      {context}
      value={inputData?.resolutionStrategy}
      on:change={e => handleChange("resolutionStrategy", e.detail)}
    />
  </PropField>
</div>

<style>
  .escalation-layout {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }
</style>
