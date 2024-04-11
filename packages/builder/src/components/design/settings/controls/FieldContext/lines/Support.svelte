<script>
  import { Line, InfoWord, DocumentationLink, Space, Text, Period } from "../typography"
  import subjects from '../subjects'
  import * as columnInfo from '../columnInfo'

  export let setExplanationSubject
  export let support

  const getIcon = (support) => {
    if (support === columnInfo.support.unsupported) {
      return "Alert"
    } else if (support === columnInfo.support.supported) {
      return "CheckmarkCircle"
    }

    return "AlertCheck"
  }

  const getColor = (support) => {
    if (support === columnInfo.support.unsupported) {
      return "var(--red)"
    } else if (support === columnInfo.support.supported) {
      return "var(--green)"
    }

    return "var(--yellow)"
  }

  const getText = (support) => {
    if (support === columnInfo.support.unsupported) {
      return "Not compatible"
    } else if (support === columnInfo.support.supported) {
      return "Compatible"
    }

    return "Partially compatible"
  }

  $: icon = getIcon(support);
  $: color = getColor(support);
  $: text = getText(support);
</script>

<Line>
  <InfoWord
    on:mouseenter={() => setExplanationSubject(subjects.support)}
    on:mouseleave={() => setExplanationSubject(subjects.none)}
    {icon}
    {color}
    {text}
  />
  <Space />
  <Text>with</Text>
  <Space />
  <DocumentationLink
    href="https://docs.budibase.com/docs/chart"
    icon="GraphPie"
    text="Chart components"
  />
  <Period />
</Line>
