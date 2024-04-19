<script>
  import { Line, InfoWord, DocumentationLink, Space, Text, Period } from "../typography"
  import subjects from '../subjects'

  export let setExplanationSubject
</script>

<Line>
  <Text value="Will be parsed as a " />
  <InfoWord
      on:mouseenter={() => setExplanationSubject(subjects.datesAsNumbers)}
      on:mouseleave={() => setExplanationSubject(subjects.none)}
    text="UNIX epoch timestamp"
  />
  <Period />
</Line>
