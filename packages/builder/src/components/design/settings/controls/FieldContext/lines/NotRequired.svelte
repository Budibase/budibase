<script>
  import { Line, InfoWord, DocumentationLink, Space, Text, Period, Comma } from "../typography"
  import subjects from '../subjects'

  export let setExplanationSubject
</script>


<Line>
  <Text>No</Text>
  <Space />
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
  <Comma />
  <Text>
    so values may be missing
  </Text>
  <Period />
</Line>

<style>
</style>
