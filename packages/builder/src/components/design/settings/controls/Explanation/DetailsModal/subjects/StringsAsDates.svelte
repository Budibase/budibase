<script>
  import { onMount } from "svelte"
  import { ExampleSection, ExampleLine, Block, Subject, Section } from './components'

  let timestamp = Date.now();

  onMount(() => {
    let run = true;

    const updateTimeStamp = () => {
      timestamp = Date.now();
      console.log(timestamp);
      if (run) {
        setTimeout(updateTimeStamp, 200)
      }
    }

    updateTimeStamp();

    return () => {
      run = false;
    }
  })
</script>

<Subject heading="Dates as Numbers">
  <Section>
    A date can be used in place of a numeric value, but it will be parsed as a <Block>UNIX epoch</Block> timestamp, which is the number of milliseconds since Jan 1st 1970. A more recent moment in time will be a higher number.
  </Section>

    <ExampleSection
      heading="Examples:"
    >
      <ExampleLine>
        1st Jan 2000<span class="separator">: </span><Block>946684800000</Block>
      </ExampleLine>
      <ExampleLine>
        1st Jan 2020<span class="separator">: </span><Block>1577836800000</Block>
      </ExampleLine>
      <ExampleLine>
        Now<span class="separator">:</span> <Block>{timestamp}</Block>
      </ExampleLine>
    </ExampleSection>
</Subject>

<style>
  .separator {
    margin-right: 5px;
  }
</style>
