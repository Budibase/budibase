<script>
  import { Line, InfoWord, DocumentationLink, Space, Text, Period } from "../typography"
  import subjects from '../subjects'

  export let setExplanationSubject
</script>

<Line>
  <Text>Any</Text>
  <Space />
<InfoWord
    on:mouseenter={() => setExplanationSubject(subjects.stringsAsNumbers)}
    on:mouseleave={() => setExplanationSubject(subjects.none)}
  text="non-number values"
/>
  <Space />
  <Text>will be ignored</Text>
  <Period />
</Line>
