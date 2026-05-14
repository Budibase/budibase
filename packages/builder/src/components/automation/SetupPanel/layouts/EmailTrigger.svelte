<script lang="ts">
  import { API } from "@/api"
  import { DrawerBindableInput } from "@/components/common/bindings"
  import AutomationBindingPanel from "@/components/common/bindings/ServerBindingPanel.svelte"
  import { PropField } from ".."
  import { automationStore, oauth2, selectedAutomation } from "@/stores/builder"
  import { Label, Helpers, Select, Button, notifications } from "@budibase/bbui"
  import {
    EmailTriggerAuthType,
    type AutomationStep,
    type AutomationTrigger,
    type BaseIOStructure,
    type EmailTriggerInputs,
  } from "@budibase/types"
  import { onMount } from "svelte"

  export let block: AutomationStep | AutomationTrigger | undefined
  export let bindings: any[] | undefined
  export let context: {} | undefined

  type SecurityOption = { label: string; value: boolean }

  let testingConnection = false

  const orderedFields = ["host", "port", "secure", "username"]
  const securityOptions: SecurityOption[] = [
    { label: "SSL/TLS", value: true },
    { label: "None/STARTTLS", value: false },
  ]
  const authOptions = [
    { label: "Password", value: EmailTriggerAuthType.PASSWORD },
    { label: "OAuth2", value: EmailTriggerAuthType.OAUTH2 },
  ]
  const getSecurityOptionLabel = (option: SecurityOption) => option.label
  const getSecurityOptionValue = (option: SecurityOption) => option.value
  const getOptionLabel = (option: { label: string }) => option.label
  const getOptionValue = (option: { value: string }) => option.value

  $: inputData = automationStore.actions.getInputData(block)
  $: schema = block?.schema.inputs?.properties || {}
  $: requiredInputs = block?.schema.inputs?.required || []
  $: authType =
    (getInputValue(inputData, "authType") as EmailTriggerAuthType) ||
    EmailTriggerAuthType.PASSWORD
  $: oauth2Options = $oauth2.configs.map(config => ({
    label: config.name,
    value: config._id!,
  }))

  onMount(() => {
    oauth2.fetch()
  })

  const getInputValue = (inputData: unknown, key: string) => {
    const data = inputData as Record<string, unknown>
    return data?.[key]
  }

  const getSecureValue = (inputData: unknown) =>
    Boolean(getInputValue(inputData, "secure"))

  const isRequired = (key: string) => {
    if (key === "password") {
      return authType === EmailTriggerAuthType.PASSWORD
    }
    if (key === "oauth2ConfigId") {
      return authType === EmailTriggerAuthType.OAUTH2
    }
    return requiredInputs.includes(key)
  }

  const getFieldLabel = (key: string, field?: BaseIOStructure) => {
    if (!field) {
      return Helpers.capitalise(key)
    }
    const requiredSuffix = isRequired(key) ? "*" : ""
    const label = `${field.title || key} ${requiredSuffix}`
    return Helpers.capitalise(label.trim())
  }

  const handleChange = (key: string, detail: unknown) => {
    if (!block) {
      return
    }
    automationStore.actions.requestUpdate({ [key]: detail }, block)
  }

  const testConnection = async () => {
    if (!inputData) {
      return
    }

    testingConnection = true
    try {
      const { valid, message } = await API.testEmailConnection({
        ...(inputData as EmailTriggerInputs),
        secure: getSecureValue(inputData),
        automationId: $selectedAutomation.data?._id,
      })
      if (valid) {
        notifications.success("Connection established.")
        return
      }

      notifications.error(message || "Connection failed.")
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      notifications.error(`Connection failed - ${errorMessage}`)
    } finally {
      testingConnection = false
    }
  }
</script>

<div class="email-trigger">
  <div class="email-trigger__title">
    <div class="email-trigger__title-row">
      <Label size="L">IMAP settings</Label>
      <Button secondary on:click={testConnection} disabled={testingConnection}>
        Test connection
      </Button>
    </div>
    <p class="email-trigger__subtitle">
      Configure your inbox connection details below.
    </p>
  </div>
  <div class="email-trigger__fields">
    {#each orderedFields as key}
      {#if schema[key] && key !== "secure"}
        <PropField
          label={getFieldLabel(key, schema[key])}
          labelTooltip={schema[key].description || ""}
          fullWidth
        >
          <DrawerBindableInput
            panel={AutomationBindingPanel}
            {bindings}
            {context}
            value={getInputValue(inputData, key)}
            {key}
            updateOnChange={false}
            placeholder={schema[key].description}
            inputType={key === "password" ? "password" : undefined}
            on:change={event => handleChange(key, event.detail)}
          />
        </PropField>
      {:else if schema[key] && key === "secure"}
        <PropField
          label={getFieldLabel(key, schema[key])}
          labelTooltip={schema[key].description || ""}
          fullWidth
        >
          <Select
            value={getSecureValue(inputData)}
            options={securityOptions}
            placeholder={false}
            getOptionLabel={getSecurityOptionLabel}
            getOptionValue={getSecurityOptionValue}
            on:change={event => handleChange(key, event.detail)}
          />
        </PropField>
      {/if}
    {/each}
    {#if schema.authType}
      <PropField
        label={getFieldLabel("authType", schema.authType)}
        labelTooltip={schema.authType.description || ""}
        fullWidth
      >
        <Select
          value={authType}
          options={authOptions}
          placeholder={false}
          {getOptionLabel}
          {getOptionValue}
          on:change={event => handleChange("authType", event.detail)}
        />
      </PropField>
    {/if}
    {#if authType === EmailTriggerAuthType.OAUTH2}
      <PropField
        label={getFieldLabel("oauth2ConfigId", schema.oauth2ConfigId)}
        labelTooltip={schema.oauth2ConfigId?.description || ""}
        fullWidth
      >
        <Select
          value={getInputValue(inputData, "oauth2ConfigId")}
          options={oauth2Options}
          {getOptionLabel}
          {getOptionValue}
          on:change={event => handleChange("oauth2ConfigId", event.detail)}
        />
      </PropField>
    {:else if schema.password}
      <PropField
        label={getFieldLabel("password", schema.password)}
        labelTooltip={schema.password.description || ""}
        fullWidth
      >
        <DrawerBindableInput
          panel={AutomationBindingPanel}
          {bindings}
          {context}
          value={getInputValue(inputData, "password")}
          key="password"
          updateOnChange={false}
          placeholder={schema.password.description}
          inputType="password"
          on:change={event => handleChange("password", event.detail)}
        />
      </PropField>
    {/if}
    {#if schema.mailbox}
      <PropField
        label={getFieldLabel("mailbox", schema.mailbox)}
        labelTooltip={schema.mailbox.description || ""}
        fullWidth
      >
        <DrawerBindableInput
          panel={AutomationBindingPanel}
          {bindings}
          {context}
          value={getInputValue(inputData, "mailbox")}
          key="mailbox"
          updateOnChange={false}
          placeholder={schema.mailbox.description}
          on:change={event => handleChange("mailbox", event.detail)}
        />
      </PropField>
    {/if}
  </div>
</div>

<style>
  .email-trigger {
    padding-bottom: var(--spacing-xl);
  }

  .email-trigger__title {
    margin-bottom: var(--spacing-m);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .email-trigger__title-row {
    align-items: center;
    display: flex;
    justify-content: space-between;
    gap: var(--spacing-s);
  }

  .email-trigger__subtitle {
    margin: 0;
    color: var(--spectrum-alias-label-text-color);
    font-size: 13px;
  }

  .email-trigger__fields {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }
</style>
