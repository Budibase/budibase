<script>
import subjects from "../subjects"
import { InfoWord, Line, Period, Text } from "../typography"

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
