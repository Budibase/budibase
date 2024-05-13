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
    if (columnType === "Multi-select") {
      return "https://docs.budibase.com/docs/multi-select"
    }
    if (columnType === "JSON") {
      return "https://docs.budibase.com/docs/json"
    }
    if (columnType === "Date/Time") {
      return "https://docs.budibase.com/docs/datetime"
    }
    if (columnType === "User") {
      return "https://docs.budibase.com/docs/user"
    }
    if (columnType === "QR") {
      return "https://docs.budibase.com/docs/barcodeqr"
    }
    if (columnType === "Relationship") {
      return "https://docs.budibase.com/docs/relationships"
    }
    if (columnType === "Formula") {
      return "https://docs.budibase.com/docs/formula"
    }
    if (columnType === "Options") {
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

  $: docLink = getDocLink(columnType);
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
    text={`${columnType} column`}
  />
  <Period />
</Line>
