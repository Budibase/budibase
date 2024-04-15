<script>
  import { onMount } from "svelte"
  import { Block, Subject, Section } from './components'

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
    A date can be used in place of a numeric value, but it will be parsed as a UNIX epoch timestamp, which is the number of milliseconds since Jan 1st 1970. A more recent Date/Time will be a higher number.
  </Section>

  <Section>
    Examples:
    <br />
    1st Jan 2000: <Block>946684800000</Block>
    <br />
    1st Jan 2020: <Block>1577836800000</Block>
    <br />
    Now: <Block>{timestamp}</Block>
  </Section>
</Subject>
