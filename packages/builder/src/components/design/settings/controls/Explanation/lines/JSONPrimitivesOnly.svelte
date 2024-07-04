<script>
import subjects from "../subjects"
import { InfoWord, Line, Period, Text } from "../typography"

export let setExplanationSubject
</script>

<Line>
  <InfoWord
    on:mouseenter={() => setExplanationSubject(subjects.scalarJsonOnly)}
    on:mouseleave={() => setExplanationSubject(subjects.none)}
    >Scalar JSON values</InfoWord
  >
  <Text
    value=" can be used with this input if their individual types are supported"
  />
  <Period />
</Line>

<style>
</style>
