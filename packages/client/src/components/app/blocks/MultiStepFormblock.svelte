<script>
  import BlockComponent from "components/BlockComponent.svelte"
  import { Helpers } from "@budibase/bbui"
  import { getContext, setContext } from "svelte"
  import { builderStore } from "stores"
  import { Utils } from "@budibase/frontend-core"
  import FormBlockWrapper from "./form/FormBlockWrapper.svelte"
  import { get, writable } from "svelte/store"
  import FormBlockComponent from "./FormBlockComponent.svelte"

  export let actionType
  export let rowId
  export let noRowsMessage
  export let steps
  export let dataSource
  export let buttonPosition = "bottom"
  export let size

  const { fetchDatasourceSchema, generateGoldenSample } = getContext("sdk")
  const component = getContext("component")
  const context = getContext("context")

  // Set current step context to force child form to use it
  const currentStep = writable(1)
  setContext("current-step", currentStep)

  let schema

  $: id = $component.id
  $: selected = $component.selected
  $: builderStep = $builderStore.metadata?.step
  $: fetchSchema(dataSource)
  $: enrichedSteps = enrichSteps(steps, schema, id)
  $: updateCurrentStep(enrichedSteps, selected, builderStep)

  // Provide additional data context for live binding eval
  export const getAdditionalDataContext = () => {
    const id = get(component).id
    const rows = get(context)[`${id}-provider`]?.rows || []
    const goldenRow = generateGoldenSample(rows)
    return {
      [`${id}-repeater`]: goldenRow,
    }
  }

  const updateCurrentStep = (steps, selected, builderStep) => {
    // If we aren't selected in the builder then just allowing the normal form
    // to take control.
    if (!selected) {
      return
    }

    // Ensure we have a valid step selected
    let newStep = Math.min(builderStep || 0, steps.length - 1)
    newStep = Math.max(newStep, 0)

    // Add 1 because the form component expects 1 indexed rather than 0 indexed
    currentStep.set(newStep + 1)
  }

  const fetchSchema = async dataSource => {
    schema = (await fetchDatasourceSchema(dataSource)) || {}
  }

  const getDefaultFields = (fields, schema) => {
    if (fields?.length) {
      return fields.filter(field => field.active)
    }
    return Object.values(schema || {})
      .filter(field => !field.autocolumn)
      .map(field => ({
        name: field.name,
        active: true,
      }))
  }

  const enrichSteps = (steps, schema, id) => {
    const safeSteps = steps?.length ? steps : [{}]
    return safeSteps.map((step, idx) => {
      const { title, fields, buttons } = step
      const defaultProps = Utils.buildMultiStepFormBlockDefaultProps({
        _id: id,
        stepCount: safeSteps.length,
        currentStep: idx,
        actionType,
        dataSource,
      })
      return {
        ...step,
        _stepId: Helpers.uuid(),
        fields: getDefaultFields(fields || [], schema),
        title: title ?? defaultProps.title,
        buttons: buttons || defaultProps.buttons,
      }
    })
  }
</script>

<FormBlockWrapper {actionType} {dataSource} {rowId} {noRowsMessage}>
  <BlockComponent
    type="form"
    context="form"
    props={{
      size,
      dataSource,
      actionType: actionType === "Create" ? "Create" : "Update",
      readonly: actionType === "View",
    }}
    styles={{
      normal: {
        width: "600px",
        "margin-left": "auto",
        "margin-right": "auto",
      },
    }}
  >
    {#each enrichedSteps as step, stepIdx (step._stepId)}
      <BlockComponent
        type="formstep"
        props={{ step: stepIdx + 1, _instanceName: `Step ${stepIdx + 1}` }}
      >
        <BlockComponent
          type="container"
          props={{
            gap: "M",
            direction: "column",
            hAlign: "stretch",
            vAlign: "top",
            size: "shrink",
          }}
        >
          <BlockComponent
            type="container"
            props={{
              direction: "column",
              gap: "S",
            }}
            order={0}
          >
            <BlockComponent
              type="container"
              props={{
                direction: "row",
                hAlign: "stretch",
                vAlign: "center",
                gap: "M",
                wrap: true,
              }}
              order={0}
            >
              <BlockComponent type="heading" props={{ text: step.title }} />
              {#if buttonPosition === "top"}
                <BlockComponent
                  type="buttongroup"
                  props={{ buttons: step.buttons }}
                />
              {/if}
            </BlockComponent>
          </BlockComponent>
          <BlockComponent type="text" props={{ text: step.desc }} order={1} />

          <BlockComponent type="container" order={2}>
            <div
              class="form-block fields"
              class:mobile={$context.device.mobile}
            >
              {#each step.fields as field, fieldIdx (`${field.field || field.name}_${fieldIdx}`)}
                <FormBlockComponent {field} {schema} order={fieldIdx} />
              {/each}
            </div>
          </BlockComponent>
          {#if buttonPosition === "bottom"}
            <BlockComponent
              type="buttongroup"
              props={{
                buttons: step.buttons,
                collapsed: step.buttonsCollapsed,
                collapsedText: step.buttonsCollapsedText,
              }}
              order={3}
            />
          {/if}
        </BlockComponent>
      </BlockComponent>
    {/each}
  </BlockComponent>
</FormBlockWrapper>

<style>
  .fields {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 8px 16px;
  }
  .fields.mobile :global(.spectrum-Form-item) {
    grid-column: span 6 !important;
  }
</style>
