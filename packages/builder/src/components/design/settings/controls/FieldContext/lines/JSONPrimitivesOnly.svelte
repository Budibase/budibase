<script>
  import { Line, InfoWord, DocumentationLink, Space, Text, Period, Comma } from "../typography"
  import subjects from '../subjects'

  export let setExplanationSubject
</script>


<Line>
  <InfoWord
  on:mouseenter={() => setExplanationSubject(subjects.scalarJsonOnly)}
>Scalar JSON values</InfoWord>
  <Text
    value=" can be used with this component if their individual types are supported"
  />
  <Period />
</Line>

<style>
</style>
