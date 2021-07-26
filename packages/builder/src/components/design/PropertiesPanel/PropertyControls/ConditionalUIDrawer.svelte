<script>
  import {
    Button,
    Body,
    Icon,
    DrawerContent,
    Layout,
    Select,
    DatePicker,
  } from "@budibase/bbui"
  import { flip } from "svelte/animate"
  import { dndzone } from "svelte-dnd-action"
  import { generate } from "shortid"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"
  import { OperatorOptions, getValidOperatorsForType } from "helpers/lucene"
  import { getBindableProperties } from "builderStore/dataBinding"
  import { currentAsset, selectedComponent, store } from "builderStore"
  import { getComponentForSettingType } from "./componentSettings"
  import PropertyControl from "./PropertyControl.svelte"

  export let conditions = []

  const flipDurationMs = 150
  const actionOptions = [
    {
      label: "Hide component",
      value: "hide",
    },
    {
      label: "Show component",
      value: "show",
    },
    {
      label: "Update setting",
      value: "update",
    },
  ]
  const valueTypeOptions = [
    {
      value: "string",
      label: "Binding",
    },
    {
      value: "number",
      label: "Number",
    },
    {
      value: "datetime",
      label: "Date",
    },
    {
      value: "boolean",
      label: "Boolean",
    },
  ]

  $: definition = store.actions.components.getDefinition(
    $selectedComponent?._component
  )
  $: settings = (definition?.settings ?? []).map(setting => {
    return {
      label: setting.label,
      value: setting.key,
    }
  })
  $: bindableProperties = getBindableProperties(
    $currentAsset,
    $store.selectedComponentId
  )
  $: conditions.forEach(link => {
    if (!link.id) {
      link.id = generate()
    }
  })

  const getSettingDefinition = key => {
    return definition?.settings?.find(setting => {
      return setting.key === key
    })
  }

  const getComponentForSetting = key => {
    const settingDefinition = getSettingDefinition(key)
    return getComponentForSettingType(settingDefinition?.type || "text")
  }

  const addCondition = () => {
    conditions = [
      ...conditions,
      {
        valueType: "string",
        id: generate(),
        action: "hide",
        operator: OperatorOptions.Equals.value,
      },
    ]
  }

  const removeLink = id => {
    conditions = conditions.filter(link => link.id !== id)
  }

  const updateLinks = e => {
    conditions = e.detail.items
  }

  const getOperatorOptions = condition => {
    return getValidOperatorsForType(condition.valueType)
  }

  const onOperatorChange = (condition, newOperator) => {
    const noValueOptions = [
      OperatorOptions.Empty.value,
      OperatorOptions.NotEmpty.value,
    ]
    condition.noValue = noValueOptions.includes(newOperator)
    if (condition.noValue) {
      condition.referenceValue = null
      condition.valueType = "string"
    }
  }

  const onValueTypeChange = (condition, newType) => {
    condition.referenceValue = null

    // Ensure a valid operator is set
    const validOperators = getValidOperatorsForType(newType).map(x => x.value)
    if (!validOperators.includes(condition.operator)) {
      condition.operator = validOperators[0] ?? OperatorOptions.Equals.value
      onOperatorChange(condition, condition.operator)
    }
  }
</script>

<DrawerContent>
  <div class="container">
    <Layout noPadding>
      {#if conditions?.length}
        <div
          class="conditions"
          use:dndzone={{
            items: conditions,
            flipDurationMs,
            dropTargetStyle: { outline: "none" },
          }}
          on:finalize={updateLinks}
          on:consider={updateLinks}
        >
          {#each conditions as condition (condition.id)}
            <div
              class="condition"
              class:update={condition.action === "update"}
              animate:flip={{ duration: flipDurationMs }}
            >
              <Icon name="DragHandle" size="XL" />
              <Select
                draggable={false}
                placeholder={null}
                options={actionOptions}
                bind:value={condition.action}
              />
              {#if condition.action === "update"}
                <Select options={settings} bind:value={condition.setting} />
                <div>TO</div>
                {#if getSettingDefinition(condition.setting)}
                  <PropertyControl
                    type={getSettingDefinition(condition.setting).type}
                    control={getComponentForSetting(condition.setting)}
                    key={getSettingDefinition(condition.setting).key}
                    value={condition.settingValue}
                    componentInstance={$selectedComponent}
                    onChange={val => (condition.settingValue = val)}
                    props={{
                      options: getSettingDefinition(condition.setting).options,
                      placeholder: getSettingDefinition(condition.setting)
                        .placeholder,
                    }}
                  />
                {:else}
                  <Select disabled placeholder=" " />
                {/if}
              {/if}
              <div>IF</div>
              <DrawerBindableInput
                bindings={bindableProperties}
                placeholder="Value"
                value={condition.newValue}
                on:change={e => (condition.newValue = e.detail)}
              />
              <Select
                placeholder={null}
                options={getOperatorOptions(condition)}
                bind:value={condition.operator}
                on:change={e => onOperatorChange(condition, e.detail)}
              />
              <Select
                disabled={condition.noValue}
                options={valueTypeOptions}
                bind:value={condition.valueType}
                placeholder={null}
                on:change={e => onValueTypeChange(condition, e.detail)}
              />
              {#if ["string", "number"].includes(condition.valueType)}
                <DrawerBindableInput
                  disabled={condition.noValue}
                  bindings={bindableProperties}
                  placeholder="Value"
                  value={condition.referenceValue}
                  on:change={e => (condition.referenceValue = e.detail)}
                />
              {:else if condition.valueType === "datetime"}
                <DatePicker
                  placeholder="Value"
                  disabled={condition.noValue}
                  bind:value={condition.referenceValue}
                />
              {:else if condition.valueType === "boolean"}
                <Select
                  placeholder="Value"
                  disabled={condition.noValue}
                  options={["True", "False"]}
                  bind:value={condition.referenceValue}
                />
              {/if}
              <Icon
                name="Close"
                hoverable
                size="S"
                on:click={() => removeLink(condition.id)}
              />
            </div>
          {/each}
        </div>
      {:else}
        <Body size="S">Add your first condition to get started.</Body>
      {/if}
      <div>
        <Button secondary icon="Add" on:click={addCondition}>
          Add condition
        </Button>
      </div>
    </Layout>
  </div>
</DrawerContent>

<style>
  .container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
  }
  .conditions {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-m);
  }
  .condition {
    gap: var(--spacing-l);
    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr auto 1fr 1fr 1fr 1fr auto;
    border-radius: var(--border-radius-s);
    transition: background-color ease-in-out 130ms;
  }
  .condition.update {
    grid-template-columns: auto 1fr 1fr auto 1fr auto 1fr 1fr 1fr 1fr auto;
  }
  .condition:hover {
    background-color: var(--spectrum-global-color-gray-100);
  }
</style>
