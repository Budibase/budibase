<script>
  import { Line, InfoWord, DocumentationLink, Space, Text, Period } from "../typography"

  export let setExplanationSubject
  export let support
</script>

<Line>
  <InfoWord
    on:mouseenter={() => setExplanationSubject("support")}
    on:mouseleave={() => setExplanationSubject(null)}
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
