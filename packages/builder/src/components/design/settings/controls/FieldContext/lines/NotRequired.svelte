<script>
  import { Line, InfoWord, DocumentationLink, Space, Text, Period, Comma } from "../typography"

  export let setExplanationSubject
</script>


<Line>
  <Text>No</Text>
  <Space />
  <InfoWord
  on:mouseenter={() => setExplanationSubject("required")}
  on:mouseleave={() => setExplanationSubject(null)}
    text="required"
  />
  <Space />
  <DocumentationLink
    icon="DataUnavailable"
    href="https://docs.budibase.com/docs/budibasedb#constraints"
    text="Constraint"
  />
  <Comma />
  <Text>
    so values may be missing
  </Text>
  <Period />
</Line>

<style>
</style>
