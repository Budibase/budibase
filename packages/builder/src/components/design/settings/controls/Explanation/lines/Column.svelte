<script>
  import {
    Line,
    InfoWord,
    DocumentationLink,
    Text,
    Period,
  } from "../typography"
  import subjects from "../subjects"

  export let columnName
  export let columnIcon
  export let columnType
  export let tableHref
  export let setExplanationSubject

  $: {
    console.log(columnName, columnIcon, columnType)
  }

  const getDocLink = columnType => {
    if (columnType === "Number") {
      return "https://docs.budibase.com/docs/number"
    }
    if (columnType === "Text") {
      return "https://docs.budibase.com/docs/text"
    }
    if (columnType === "Attachment") {
      return "https://docs.budibase.com/docs/attachments"
    }
    if (columnType === "Multi attachment") {
      // No distinct multi attachment docs, link to attachment instead
      return "https://docs.budibase.com/docs/attachments"
    }
    if (columnType === "Multi select") {
      return "https://docs.budibase.com/docs/multi-select"
    }
    if (columnType === "JSON") {
      return "https://docs.budibase.com/docs/json"
    }
    if (columnType === "Date / time") {
      return "https://docs.budibase.com/docs/datetime"
    }
    if (columnType === "User") {
      return "https://docs.budibase.com/docs/users-1"
    }
    if (columnType === "Multi user") {
      // No distinct multi user docs, link to user instead
      return "https://docs.budibase.com/docs/users-1"
    }
    if (columnType === "Barcode / QR") {
      return "https://docs.budibase.com/docs/barcodeqr"
    }
    if (columnType === "Relationship") {
      return "https://docs.budibase.com/docs/relationships"
    }
    if (columnType === "Formula") {
      return "https://docs.budibase.com/docs/formula"
    }
    if (columnType === "Single select") {
      return "https://docs.budibase.com/docs/options"
    }
    if (columnType === "BigInt") {
      // No BigInt docs
      return null
    }
    if (columnType === "Boolean") {
      return "https://docs.budibase.com/docs/boolean-truefalse"
    }
    if (columnType === "Signature") {
      // No Signature docs
      return null
    }

    return null
  }

  $: docLink = getDocLink(columnType)

  const getColumnTypeName = columnType => {
    if (!columnType) {
      return "Unknown"
    }
    if (columnType === "Date / time") {
      return "Date/Time"
    }
    if (columnType === "Barcode / QR") {
      return "Barcode/QR"
    }
    if (columnType === "Single select") {
      return "Options"
    }
    if (columnType === "Multi select") {
      return "Multi-select"
    }
    if (columnType === "Multi attachment") {
      return "Multi-attachment"
    }
    if (columnType === "Multi user") {
      return "Multi-user"
    }

    return columnType
  }
</script>

<Line noWrap>
  <InfoWord
    on:mouseenter={() => setExplanationSubject(subjects.column)}
    on:mouseleave={() => setExplanationSubject(subjects.none)}
    href={tableHref}
    text={columnName}
  />
  <Text value=" is a " />
  <DocumentationLink
    disabled={docLink === null}
    href={docLink}
    icon={columnIcon}
    text={`${getColumnTypeName(columnType)} column`}
  />
  <Period />
</Line>
