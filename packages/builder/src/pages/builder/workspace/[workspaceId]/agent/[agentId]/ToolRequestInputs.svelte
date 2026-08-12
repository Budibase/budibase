<script lang="ts">
  import {
    ActionButton,
    Body,
    Button,
    Popover,
    Select,
    Toggle,
    type PopoverAPI,
  } from "@budibase/bbui"
  import type {
    AgentToolRequestInputConfig,
    AgentToolRequestInputParameter,
  } from "@budibase/types"
  import { confirm } from "@/helpers/confirm"
  import type { AgentTool } from "./toolTypes"

  let {
    tool,
    requestInputs = [],
    onUpdated,
  }: {
    tool: AgentTool
    requestInputs?: AgentToolRequestInputConfig[]
    onUpdated: (
      requestInputs: AgentToolRequestInputConfig[]
    ) => Promise<boolean>
  } = $props()

  let popover: PopoverAPI
  let anchor = $state<HTMLElement>()
  let selectedParameterKey = $state("")

  const pathKey = (parameterPath: string[]) => JSON.stringify(parameterPath)
  let parameterByKey = $derived(
    new Map(
      (tool.requestInputParameters ?? []).map(parameter => [
        pathKey(parameter.parameterPath),
        parameter,
      ])
    )
  )
  let configuredPaths = $derived(
    new Set(requestInputs.map(input => pathKey(input.parameterPath)))
  )
  let availableParameters = $derived(
    (tool.requestInputParameters ?? []).filter(
      parameter => !configuredPaths.has(pathKey(parameter.parameterPath))
    )
  )
  let parameterOptions = $derived(
    availableParameters.map(parameter => ({
      label: `${parameter.name} (${parameter.type})`,
      value: pathKey(parameter.parameterPath),
    }))
  )

  const show = (event: MouseEvent) => {
    anchor = event.currentTarget as HTMLElement
    selectedParameterKey = parameterOptions[0]?.value ?? ""
    popover.show()
  }

  const add = async () => {
    const parameter = parameterByKey.get(selectedParameterKey)
    if (!parameter) return

    const saved = await onUpdated([
      ...requestInputs,
      {
        parameterPath: parameter.parameterPath,
        required: true,
      },
    ])
    if (saved) {
      selectedParameterKey = parameterOptions[0]?.value ?? ""
    }
  }

  const setRequired = async ({
    input,
    required,
  }: {
    input: AgentToolRequestInputConfig
    required: boolean
  }) => {
    await onUpdated(
      requestInputs.map(existing =>
        pathKey(existing.parameterPath) === pathKey(input.parameterPath)
          ? { ...existing, required }
          : existing
      )
    )
  }

  const remove = async (input: AgentToolRequestInputConfig) => {
    const parameter = parameterByKey.get(pathKey(input.parameterPath))
    const confirmed = await confirm({
      title: "Confirm deletion",
      body: `Remove the “${parameter?.name ?? input.parameterPath.join(".")}" request input?`,
      okText: "Remove",
      warning: true,
    })
    if (!confirmed) return

    await onUpdated(
      requestInputs.filter(
        existing =>
          pathKey(existing.parameterPath) !== pathKey(input.parameterPath)
      )
    )
  }

  const parameterSubtitle = (parameter: AgentToolRequestInputParameter) => {
    const details = [parameter.type, parameter.parameterPath.join(" → ")]
    if (parameter.type === "select" || parameter.type === "multiselect") {
      details.push(parameter.options.join(", "))
    }
    return details.join(" · ")
  }
</script>

{#if tool.requestInputParameters?.length || requestInputs.length}
  <ActionButton size="S" quiet on:click={show}>
    Request inputs{requestInputs.length ? ` (${requestInputs.length})` : ""}
  </ActionButton>
{/if}

<Popover
  bind:this={popover}
  {anchor}
  align="right"
  minWidth={360}
  maxWidth={360}
  resizable={false}
>
  <div class="request-inputs-popover">
    <div>
      <Body size="S">Request inputs</Body>
      <Body size="XS" color="var(--spectrum-global-color-gray-700)">
        Collect these arguments before running the tool.
      </Body>
    </div>

    {#if requestInputs.length}
      <div class="request-input-list">
        {#each requestInputs as input (pathKey(input.parameterPath))}
          {@const parameter = parameterByKey.get(pathKey(input.parameterPath))}
          <div class="request-input-row">
            <div class="request-input-details">
              <span>{parameter?.name ?? input.parameterPath.join(".")}</span>
              {#if parameter}
                <small>{parameterSubtitle(parameter)}</small>
              {:else}
                <small class="invalid">Argument is no longer available</small>
              {/if}
            </div>
            <Toggle
              text="Required"
              noPadding
              noMargin
              disabled={parameter?.nativeRequired}
              value={parameter?.nativeRequired || input.required}
              on:change={event =>
                setRequired({ input, required: event.detail })}
            />
            <Button quiet size="S" on:click={() => remove(input)}>
              Remove
            </Button>
          </div>
        {/each}
      </div>
    {/if}

    {#if parameterOptions.length}
      <div class="add-request-input">
        <Select
          label="Tool argument"
          bind:value={selectedParameterKey}
          options={parameterOptions}
          placeholder={false}
        />
        <Button
          secondary
          size="S"
          disabled={!selectedParameterKey}
          on:click={add}
        >
          Add
        </Button>
      </div>
    {:else if !requestInputs.length}
      <Body size="XS">No supported arguments are available.</Body>
    {/if}
  </div>
</Popover>

<style>
  .request-inputs-popover {
    box-sizing: border-box;
    width: 360px;
    padding: var(--spacing-l);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
    background: var(--spectrum-global-color-gray-50);
  }

  .request-input-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .request-input-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    align-items: center;
    gap: var(--spacing-m);
  }

  .request-input-details {
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .request-input-details small {
    overflow: hidden;
    color: var(--spectrum-global-color-gray-700);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .request-input-details .invalid {
    color: var(--spectrum-semantic-negative-color-default);
  }

  .add-request-input {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
    gap: var(--spacing-m);
  }
</style>
