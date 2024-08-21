<script>
  import { Line, InfoWord, Text, Period } from "../typography"
  import subjects from "../subjects"

  export let setExplanationSubject
</script>

<Line>
  <Text value="Will be converted to a number, ignoring any " />
  <InfoWord
    on:mouseenter={() => setExplanationSubject(subjects.stringsAsNumbers)}
    on:mouseleave={() => setExplanationSubject(subjects.none)}
    text="non-numerical values"
  />
  <Period />
</Line>
