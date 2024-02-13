<script>
  import BlockComponent from "components/BlockComponent.svelte"
  import { getContext, setContext } from "svelte"
  import { builderStore } from "stores"
  import { ComponentUtils } from "@budibase/frontend-core"
  import FormBlockWrapper from "./form/FormBlockWrapper.svelte"
  import { writable } from "svelte/store"

  export let actionType
  export let rowId
  export let noRowsMessage
  export let steps
  export let dataSource
  export let buttonPosition = "bottom"
  export let size

  const { fetchDatasourceSchema } = getContext("sdk")
  const component = getContext("component")
  const context = getContext("context")

  // Set current step context to force child form to use it
  const currentStep = writable(1)
  setContext("current-step", currentStep)

  let schema

  $: fetchSchema(dataSource)
  $: enrichedSteps = enrichSteps(steps, schema, $component.id, $currentStep)
  $: updateCurrentStep(enrichedSteps, $builderStore, $component)

  const updateCurrentStep = (steps, builderStore, component) => {
    const { componentId, step } = builderStore.metadata || {}

    // If we aren't in the builder or aren't selected then don't update the step
    // context at all, allowing the normal form to take control.
    if (
      !component.selected ||
      !builderStore.inBuilder ||
      componentId !== component.id
    ) {
      return
    }

    // Ensure we have a valid step selected
    let newStep = Math.min(step || 0, steps.length - 1)

    // Sanity check
    newStep = Math.max(newStep, 0)

    // Add 1 because the form component expects 1 indexed rather than 0 indexed
    currentStep.set(newStep + 1)
  }

  const fetchSchema = async () => {
    schema = (await fetchDatasourceSchema(dataSource)) || {}
  }

  const enrichSteps = (steps, schema, id) => {
    const safeSteps = steps?.length ? steps : [{}]
    return safeSteps.map((step, idx) => {
      const { title, fields, buttons } = step
      const defaultProps =
        ComponentUtils.generateDefaultMultiStepFormBlockProps({
          _id: id,
          actionType,
          schema,
          stepCount: safeSteps.length,
          currentStep: idx,
          dataSource,
        })
      return {
        ...step,
        title: title ?? defaultProps.title,
        buttons: buttons || defaultProps.buttons || [],
        fields: fields || defaultProps.fields || [],
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
    {#each enrichedSteps as step, stepIdx (step._id)}
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
              {#each step.fields as field, fieldIdx (`${field.field}_${fieldIdx}`)}
                {#if field.active}
                  <BlockComponent
                    type={field._component}
                    props={field}
                    order={fieldIdx}
                    interactive
                    name={field.field}
                  />
                {/if}
              {/each}
            </div>
          </BlockComponent>
          {#if buttonPosition === "bottom"}
            <BlockComponent
              type="buttongroup"
              props={{ buttons: step.buttons }}
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
