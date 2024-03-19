<script>
  import BlockComponent from "components/BlockComponent.svelte"
  import { FieldType } from "@budibase/types"

  export let field
  export let schema
  export let order

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

  const getFieldSchema = field => {
    const fieldSchemaName = field.field || field.name
    if (!fieldSchemaName || !schema?.[fieldSchemaName]) {
      return null
    }
    return schema[fieldSchemaName]
  }

  const getComponentForField = field => {
    const fieldSchema = getFieldSchema(field)
    if (!fieldSchema) {
      return null
    }
    const { type } = fieldSchema
    return FieldTypeToComponentMap[type]
  }

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

    fieldProps = {
      ...getPropsByType(field),
      ...fieldProps,
    }
    return fieldProps
  }

  function getPropsByType(field) {
    const propsMapByType = {
      [FieldType.ATTACHMENT]: (_field, schema) => {
        return {
          maximum: schema?.constraints?.length?.maximum,
        }
      },
    }

    const fieldSchema = getFieldSchema(field)
    const mapper = propsMapByType[fieldSchema.type]
    if (mapper) {
      return mapper(field, fieldSchema)
    }
  }
</script>

{#if getComponentForField(field) && field.active}
  <BlockComponent
    type={getComponentForField(field)}
    props={getPropsForField(field)}
    {order}
    interactive
    name={field?.field}
  />
{/if}
