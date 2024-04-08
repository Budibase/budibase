<script>
  import { Line, InfoWord, DocumentationLink, Space, Text, Period } from "../typography"
  export let setExplanationSubject
</script>

<Line>
  <Text>Any</Text>
  <Space />
<InfoWord
    on:mouseenter={() => setExplanationSubject("stringsAndNumbers")}
    on:mouseleave={() => setExplanationSubject(null)}
  text="non-number values"
/>
  <Space />
  <Text>will be ignored</Text>
  <Period />
</Line>
