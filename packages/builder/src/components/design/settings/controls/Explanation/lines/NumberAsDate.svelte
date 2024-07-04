<script>
import subjects from "../subjects"
import { InfoWord, Line, Period, Text } from "../typography"

export let setExplanationSubject
</script>

<Line>
  <Text value="Will be treated as a " />
  <InfoWord
    on:mouseenter={() => setExplanationSubject(subjects.numbersAsDates)}
    on:mouseleave={() => setExplanationSubject(subjects.none)}
    text="UNIX time value"
  />
  <Period />
</Line>
