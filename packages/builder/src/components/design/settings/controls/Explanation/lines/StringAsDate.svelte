<script>
import subjects from "../subjects"
import { InfoWord, Line, Period, Text } from "../typography"

export let setExplanationSubject
</script>

<Line>
  <Text value="Will be treated as a " />
  <InfoWord
    on:mouseenter={() => setExplanationSubject(subjects.stringsAsDates)}
    on:mouseleave={() => setExplanationSubject(subjects.none)}
    text="UNIX time or ISO 8601 value"
  />
  <Period />
</Line>
