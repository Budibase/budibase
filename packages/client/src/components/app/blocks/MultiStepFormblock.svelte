<script>
  import BlockComponent from "components/BlockComponent.svelte"
  import { getContext } from "svelte"
  import { builderStore } from "stores"
  import { Utils } from "@budibase/frontend-core"
  import FormBlockWrapper from "./form/FormBlockWrapper.svelte"

  export let actionType
  export let rowId
  export let noRowsMessage
  export let steps
  export let dataSource
  export let initialFormStep = 1

  const { fetchDatasourceSchema } = getContext("sdk")
  const component = getContext("component")

  const FieldTypeToComponentMap = {
    string: "stringfield",
    number: "numberfield",
    bigint: "bigintfield",
    options: "optionsfield",
    array: "multifieldselect",
    boolean: "booleanfield",
    longform: "longformfield",
    datetime: "datetimefield",
    attachment: "attachmentfield",
    link: "relationshipfield",
    json: "jsonfield",
    barcodeqr: "codescanner",
    bb_reference: "bbreferencefield",
  }

  let schema

  $: fetchSchema(dataSource)
  $: enrichedSteps = enrichSteps(steps, schema, $component.id)
  $: currentStep = getCurrentStep(enrichedSteps, $builderStore, $component)

  const getCurrentStep = (steps, builderStore, component) => {
    const { componentId, step } = builderStore.metadata || {}

    // If we aren't in the builder or aren't selected then don't return a form
    // step at all. This will let the form component take over state for which
    // step is active.
    if (
      !component.selected ||
      !builderStore.inBuilder ||
      componentId !== component.id
    ) {
      return null
    }

    // Ensure we have a valid step selected
    let currentStep = Math.min(step || 0, steps.length - 1)

    // Sanity check
    currentStep = Math.max(currentStep, 0)

    // Add 1 because the form component expects 1 indexed rather than 0 indexed
    return currentStep + 1
  }

  const getPropsForField = field => {
    if (field._component) {
      return field
    }
    return {
      field: field.name,
      label: field.name,
      placeholder: field.name,
      _instanceName: field.name,
    }
  }

  const getComponentForField = field => {
    const fieldSchemaName = field.field || field.name
    if (!fieldSchemaName || !schema?.[fieldSchemaName]) {
      return null
    }
    const type = schema[fieldSchemaName].type
    return FieldTypeToComponentMap[type]
  }

  const fetchSchema = async () => {
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
      }))
  }

  const enrichSteps = (steps, schema, id) => {
    const safeSteps = steps?.length ? steps : [{}]
    return safeSteps.map((step, idx) => {
      const { title, desc, fields, buttons } = step
      const defaultProps = Utils.buildMultiStepFormBlockDefaultProps({
        _id: id,
        stepCount: safeSteps.length,
        currentStep: idx,
        actionType,
        dataSource,
      })
      return {
        fields: getDefaultFields(fields || [], schema),
        title: title ?? defaultProps.title,
        desc,
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
      dataSource,
      initialFormStep,
      step: currentStep,
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
    {#each enrichedSteps as step, idx}
      <BlockComponent
        type="formstep"
        props={{ step: idx + 1, _instanceName: `Step ${idx + 1}` }}
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
          <BlockComponent type="container" order={0}>
            <BlockComponent type="heading" props={{ text: step.title }} />
          </BlockComponent>
          <BlockComponent type="text" props={{ text: step.desc }} order={1} />
          <BlockComponent type="fieldgroup" order={2}>
            {#each step.fields as field, fieldIdx}
              {#if getComponentForField(field)}
                <BlockComponent
                  type={getComponentForField(field)}
                  props={getPropsForField(field)}
                  order={fieldIdx}
                  interactive
                  name={field.field}
                />
              {/if}
            {/each}
          </BlockComponent>
          <BlockComponent
            type="buttongroup"
            props={{ buttons: step.buttons }}
            styles={{
              normal: {
                "margin-top": "16px",
              },
            }}
            order={3}
          />
        </BlockComponent>
      </BlockComponent>
    {/each}
  </BlockComponent>
</FormBlockWrapper>
