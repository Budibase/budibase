<script>
  import { Line, InfoWord, DocumentationLink, Space, Text, Period } from "../typography"
  import subjects from '../subjects'

  export let columnName
  export let columnIcon
  export let columnType
  export let tableHref
  export let setExplanationSubject

  const getDocLink = (columnType) => {
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

    return ""
  }
</script>

<Line>
  <InfoWord
    on:mouseenter={() => setExplanationSubject(subjects.column)}
    on:mouseleave={() => setExplanationSubject(subjects.none)}
    href={tableHref}
    text={columnName}
  />
  <Space />
  <Text>is a</Text>
  <Space />
  <DocumentationLink
    href={getDocLink(columnType)}
    icon={columnIcon}
    text={`${columnType} column`}
  />
  <Period />
</Line>
