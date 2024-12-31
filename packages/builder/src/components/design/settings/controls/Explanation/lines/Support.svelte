<script>
  import { Line, InfoWord, DocumentationLink, Text } from "../typography"
  import subjects from "../subjects"
  import * as explanation from "../explanation"
  import { componentStore } from "@/stores/builder"

  export let setExplanationSubject
  export let support
  export let componentName

  const getComponentDefinition = componentName => {
    const components = $componentStore.components || {}
    return components[componentName] || null
  }

  const getIcon = support => {
    if (support === explanation.support.unsupported) {
      return "Alert"
    } else if (support === explanation.support.supported) {
      return "CheckmarkCircle"
    }

    return "AlertCheck"
  }

  const getColor = support => {
    if (support === explanation.support.unsupported) {
      return "var(--red)"
    } else if (support === explanation.support.supported) {
      return "var(--green)"
    }

    return "var(--yellow)"
  }

  const getText = support => {
    if (support === explanation.support.unsupported) {
      return "Not compatible"
    } else if (support === explanation.support.supported) {
      return "Compatible"
    }

    return "Partially compatible"
  }

  $: icon = getIcon(support)
  $: color = getColor(support)
  $: text = getText(support)
  $: componentDefinition = getComponentDefinition(componentName)
</script>

{#if componentDefinition}
  <Line>
    <InfoWord
      on:mouseenter={() => setExplanationSubject(subjects.support)}
      on:mouseleave={() => setExplanationSubject(subjects.none)}
      {icon}
      {color}
      {text}
    />
    <Text value=" with this " />
    <DocumentationLink
      href={componentDefinition.documentationLink}
      icon={componentDefinition.icon}
      text={componentDefinition.name}
    />
    <Text value=" input." />
  </Line>
{/if}
