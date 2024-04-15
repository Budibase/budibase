<script>
  import { Block, Subject, Section } from './components'
</script>

<Subject heading="Text as Numbers">
  <Section>
    Text can be used in place of numbers in certain scenarios, but care needs to be taken, as text that doesn't contain a strictly base-ten integer or decimal value may lead to unexpected behavior.
  </Section>

  <Section>
    Examples:
    <br />
    <Block>"100"</Block>{" -> "}<Block>100</Block>
    <br />
    <Block>"100k"</Block>{" -> "}<Block>100</Block>
    <br />
    <Block>"100,000"</Block>{" -> "}<Block>100</Block>
    <br />
    <Block>"100 million"</Block>{" -> "}<Block>100</Block>
    <br />
    <Block>"100.9"</Block>{" -> "}<Block>100.9</Block>
    <br />
    <Block>"One hundred"</Block>{" -> "}<Block>Error</Block>
  </Section>
</Subject>
