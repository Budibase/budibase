<script>
  import { Line, InfoWord, DocumentationLink, Text } from "../typography"
  import { FieldType } from "@budibase/types"
  import { FIELDS } from "@/constants/backend"
  import subjects from "../subjects"

  export let schema
  export let name
  export let tableHref
  export let setExplanationSubject

  const getTypeName = schema => {
    const fieldDefinition = Object.values(FIELDS).find(
      f => f.type === schema?.type
    )

    if (schema?.type === "jsonarray") {
      return "JSON Array"
    }
    if (schema?.type === "options") {
      return "Options"
    }

    return fieldDefinition?.name || schema?.type || "Unknown"
  }

  const getTypeIcon = schema => {
    const fieldDefinition = Object.values(FIELDS).find(
      f => f.type === schema?.type
    )

    if (schema?.type === "jsonarray") {
      return "BracketsSquare"
    }

    return fieldDefinition?.icon || "Circle"
  }

  const getDocLink = columnType => {
    if (columnType === FieldType.NUMBER) {
      return "https://docs.budibase.com/docs/number"
    }
    if (columnType === FieldType.STRING) {
      return "https://docs.budibase.com/docs/text"
    }
    if (columnType === FieldType.LONGFORM) {
      return "https://docs.budibase.com/docs/text"
    }
    if (columnType === FieldType.ATTACHMENT_SINGLE) {
      return "https://docs.budibase.com/docs/attachments"
    }
    if (columnType === FieldType.ATTACHMENTS) {
      // No distinct multi attachment docs, link to attachment instead
      return "https://docs.budibase.com/docs/attachments"
    }
    if (columnType === FieldType.ARRAY) {
      return "https://docs.budibase.com/docs/multi-select"
    }
    if (columnType === FieldType.JSON) {
      return "https://docs.budibase.com/docs/json"
    }
    if (columnType === "jsonarray") {
      return "https://docs.budibase.com/docs/json"
    }
    if (columnType === FieldType.DATETIME) {
      return "https://docs.budibase.com/docs/datetime"
    }
    if (columnType === FieldType.BB_REFERENCE_SINGLE) {
      return "https://docs.budibase.com/docs/users-1"
    }
    if (columnType === FieldType.BB_REFERENCE) {
      return "https://docs.budibase.com/docs/users-1"
    }
    if (columnType === FieldType.BARCODEQR) {
      return "https://docs.budibase.com/docs/barcodeqr"
    }
    if (columnType === FieldType.LINK) {
      return "https://docs.budibase.com/docs/relationships"
    }
    if (columnType === FieldType.FORMULA) {
      return "https://docs.budibase.com/docs/formula"
    }
    if (columnType === FieldType.AI) {
      return "https://docs.budibase.com/docs/ai"
    }
    if (columnType === FieldType.OPTIONS) {
      return "https://docs.budibase.com/docs/options"
    }
    if (columnType === FieldType.BOOLEAN) {
      return "https://docs.budibase.com/docs/boolean-truefalse"
    }
    if (columnType === FieldType.SIGNATURE_SINGLE) {
      // No Signature docs
      return null
    }
    if (columnType === FieldType.BIGINT) {
      // No BigInt docs
      return null
    }

    return null
  }

  // NOTE The correct indefinite article is based on the pronounciation of the word it precedes, not the spelling. So simply checking if the word begins with a vowel is not sufficient.

  // e.g., `an honor`, `a user`
  const getIndefiniteArticle = schema => {
    const anTypes = [
      FieldType.OPTIONS,
      null, // `null` gets parsed as "unknown"
      undefined, // `undefined` gets parsed as "unknown"
    ]

    if (anTypes.includes(schema?.type)) {
      return "an"
    }

    return "a"
  }

  $: columnTypeName = getTypeName(schema)
  $: columnIcon = getTypeIcon(schema)
  $: docLink = getDocLink(schema?.type)
  $: indefiniteArticle = getIndefiniteArticle(schema)
</script>

<Line noWrap>
  <InfoWord
    on:mouseenter={() => setExplanationSubject(subjects.column)}
    on:mouseleave={() => setExplanationSubject(subjects.none)}
    href={tableHref}
    text={name}
  />
  <Text value={` is ${indefiniteArticle} `} />
  <DocumentationLink
    disabled={docLink === null}
    href={docLink}
    icon={columnIcon}
    text={columnTypeName}
  />
  <Text value=" column." />
</Line>
