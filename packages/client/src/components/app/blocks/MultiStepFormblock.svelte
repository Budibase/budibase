<script>
  import BlockComponent from "components/BlockComponent.svelte"
  import Block from "components/Block.svelte"
  import { getContext } from "svelte"
  import { builderStore } from "stores"
  import { Utils } from "@budibase/frontend-core"

  export let componentInstance
  export let steps
  export let dataSource
  export let initialFormStep = 1

  const { fetchDatasourceSchema } = getContext("sdk")
  const component = getContext("component")

  let schema
  let formId

  const getCurrentStep = () => {
    if ($builderStore?.component?._id === $component.id) {
      return $builderStore?.component.step
    }
    return 0
  }

  $: currentStep = getCurrentStep(
    $builderStore?.component?._id,
    componentInstance
  )

  $: fetchSchema(dataSource)

  const getPropsForField = field => {
    let fieldProps = field._component
      ? {
          ...field,
        }
      : {
          field: field.name,
          label: field.name,
          placeholder: field.name,
          _instanceName: field.name,
        }
    return fieldProps
  }

  const getDefaultFields = (fields, schema) => {
    if (!schema) {
      return []
    }
    let defaultFields = []

    if (!fields || fields.length === 0) {
      Object.values(schema)
        .filter(field => !field.autocolumn)
        .forEach(field => {
          defaultFields.push({
            name: field.name,
            active: true,
          })
        })
    }
    return [...fields, ...defaultFields].filter(field => field.active)
  }

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

  $: stepProps = steps?.map((step, idx) => {
    const { title, desc, fields, buttons } = step
    return {
      fields: getDefaultFields(fields || [], schema),
      title,
      desc,
      buttons:
        buttons ||
        Utils.buildMultiStepFormBlockButtonConfig({
          _id: $component.id,
          stepCount: steps?.length ?? 0,
          currentStep: idx,
        }),
    }
  })
</script>

{#key stepProps}
  <Block>
    <BlockComponent
      type="form"
      props={{
        dataSource,
        initialFormStep,
        step: $builderStore.inBuilder === true ? currentStep + 1 : null,
      }}
      context="form"
      bind:id={formId}
    >
      {#each steps || [] as step, idx ("step" + step._id)}
        <BlockComponent
          type="formstep"
          props={{ step: idx + 1, _instanceName: `Step ${idx + 1}` }}
          styles={{
            normal: {
              width: "600px",
              "margin-left": "auto",
              "margin-right": "auto",
            },
          }}
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
            <BlockComponent type="container">
              <BlockComponent
                type="heading"
                props={{ text: stepProps?.[idx]?.title }}
              />
            </BlockComponent>

            <BlockComponent
              type="text"
              props={{ text: stepProps?.[idx]?.desc }}
            />

            <BlockComponent type="fieldgroup">
              {#each stepProps?.[idx]?.fields || [] as field, fieldIdx ("field_" + fieldIdx)}
                {#if getComponentForField(field) && field.active}
                  <BlockComponent
                    type={getComponentForField(field)}
                    props={getPropsForField(field)}
                    order={idx}
                    interactive
                    name={field?.field}
                  />
                {/if}
              {/each}
            </BlockComponent>
            <BlockComponent
              type="buttongroup"
              props={{ buttons: stepProps?.[idx]?.buttons }}
              styles={{
                normal: {
                  "margin-top": "16px",
                },
              }}
            />
          </BlockComponent>
        </BlockComponent>
      {/each}
    </BlockComponent>
  </Block>
{/key}
