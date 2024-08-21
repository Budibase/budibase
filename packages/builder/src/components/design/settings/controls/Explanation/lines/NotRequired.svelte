<script>
  import { Line, InfoWord, DocumentationLink, Space, Text } from "../typography"
  import subjects from "../subjects"

  export let setExplanationSubject
</script>

<Line>
  <Text value="No " />
  <InfoWord
    on:mouseenter={() => setExplanationSubject(subjects.notRequired)}
    on:mouseleave={() => setExplanationSubject(subjects.none)}
    text="required"
  />
  <Space />
  <DocumentationLink
    icon="DataUnavailable"
    href="https://docs.budibase.com/docs/budibasedb#constraints"
    text="Constraint"
  />
  <Text value=", so values may be missing." />
</Line>

<style>
</style>
