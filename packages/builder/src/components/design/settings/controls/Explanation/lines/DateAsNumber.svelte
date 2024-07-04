<script>
import subjects from "../subjects"
import { InfoWord, Line, Period, Text } from "../typography"

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
