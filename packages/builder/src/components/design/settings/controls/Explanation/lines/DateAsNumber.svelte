<script>
  import { Line, InfoWord, Text, Period } from "../typography"
  import subjects from "../subjects"

  export let setExplanationSubject
</script>

<Line>
  <Text value="Will be converted to a " />
  <InfoWord
    on:mouseenter={() => setExplanationSubject(subjects.datesAsNumbers)}
    on:mouseleave={() => setExplanationSubject(subjects.none)}
    text="UNIX time value"
  />
  <Period />
</Line>
