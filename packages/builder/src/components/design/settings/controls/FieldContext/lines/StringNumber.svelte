<script>
  import { Line, InfoWord, DocumentationLink, Space, Text, Period } from "../typography"
  import subjects from '../subjects'

  export let setExplanationSubject
</script>

<Line>
  <Text value="The component will ignore any " />
  <InfoWord
      on:mouseenter={() => setExplanationSubject(subjects.stringsAsNumbers)}
      on:mouseleave={() => setExplanationSubject(subjects.none)}
    text="non-number values"
  />
  <Period />
</Line>
