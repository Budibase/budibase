<script>
  import { Line, InfoWord, DocumentationLink, Space, Text, Period } from "../typography"
  import subjects from '../subjects'
  import * as explanation from '../explanation'

  export let setExplanationSubject
  export let support

  const getIcon = (support) => {
    if (support === explanation.support.unsupported) {
      return "Alert"
    } else if (support === explanation.support.supported) {
      return "CheckmarkCircle"
    }

    return "AlertCheck"
  }

  const getColor = (support) => {
    if (support === explanation.support.unsupported) {
      return "var(--red)"
    } else if (support === explanation.support.supported) {
      return "var(--green)"
    }

    return "var(--yellow)"
  }

  const getText = (support) => {
    if (support === explanation.support.unsupported) {
      return "Not compatible"
    } else if (support === explanation.support.supported) {
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
  <Text value=" with " />
  <DocumentationLink
    href="https://docs.budibase.com/docs/chart"
    icon="GraphPie"
    text="Chart components"
  />
  <Period />
</Line>
