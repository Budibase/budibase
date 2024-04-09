<script>
  import { Line, InfoWord, DocumentationLink, Space, Text, Period } from "../typography"
  import subjects from '../subjects'

  export let setExplanationSubject
  export let support
</script>

<Line>
  <InfoWord
    on:mouseenter={() => setExplanationSubject(subjects.support)}
    on:mouseleave={() => setExplanationSubject(subjects.none)}
    icon={support.icon}
    color={support.iconColor}
    text={support.text}
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
