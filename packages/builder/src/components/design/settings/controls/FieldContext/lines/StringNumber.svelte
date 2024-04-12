<script>
  import { Line, InfoWord, DocumentationLink, Space, Text, Period } from "../typography"
  import subjects from '../subjects'

  export let setExplanationSubject
</script>

<Line>
  <Text value="Any " />
  <InfoWord
      on:mouseenter={() => setExplanationSubject(subjects.stringsAsNumbers)}
      on:mouseleave={() => setExplanationSubject(subjects.none)}
    text="non-number values"
  />
  <Text value=" will be ignored." />
</Line>
