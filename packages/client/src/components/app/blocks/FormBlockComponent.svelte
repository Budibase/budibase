<script>
  import BlockComponent from "components/BlockComponent.svelte"
  import { FieldType } from "@budibase/types"

  export let field
  export let schema
  export let order

  const FieldTypeToComponentMap = {
    [FieldType.STRING]: "stringfield",
    [FieldType.NUMBER]: "numberfield",
    [FieldType.BIGINT]: "bigintfield",
    [FieldType.OPTIONS]: "optionsfield",
    [FieldType.ARRAY]: "multifieldselect",
    [FieldType.BOOLEAN]: "booleanfield",
    [FieldType.LONGFORM]: "longformfield",
    [FieldType.DATETIME]: "datetimefield",
    [FieldType.SIGNATURE_SINGLE]: "signaturesinglefield",
    [FieldType.ATTACHMENTS]: "attachmentfield",
    [FieldType.ATTACHMENT_SINGLE]: "attachmentsinglefield",
    [FieldType.LINK]: "relationshipfield",
    [FieldType.JSON]: "jsonfield",
    [FieldType.BARCODEQR]: "codescanner",
    [FieldType.BB_REFERENCE]: "bbreferencefield",
    [FieldType.BB_REFERENCE_SINGLE]: "bbreferencesinglefield",
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
      [FieldType.ATTACHMENTS]: (_field, schema) => {
        return {
          maximum: schema?.constraints?.length?.maximum,
        }
      },
      [FieldType.DATETIME]: (_field, schema) => {
        const props = {
          valueAsTimestamp: !schema?.timeOnly,
        }
        if (schema?.dateOnly) {
          props.enableTime = false
        }
        return props
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
