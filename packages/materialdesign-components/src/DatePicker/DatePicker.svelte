<script>
  import { onMount } from "svelte"
  import {
    startOfMonth,
    endOfMonth,
    getDate,
    getMonth,
    getYear,
    addMonths,
    subMonths,
    format,
  } from "date-fns"
  import { MDCMenu } from "@material/menu"
  import { Textfield } from "../Textfield"
  import Icon from "../Common/Icon.svelte"
  import ripple from "../Common/Ripple.js"
  import { Body1, Body2, Caption } from "../Typography"
  import { IconButton } from "../IconButton"

  let textFieldHeight = null
  let menu
  let instance

  let daysArr = []
  let navDate = new Date()
  const weekdayMap = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  export let date = new Date()
  export let open = true

  onMount(() => {
    if (!!menu) {
      instance = new MDCMenu(menu)
      instance.open = true
      instance.setFixedPostion = true
    }
  })

  function selectDate(dayOfMonth) {
    let month = getMonth(navDate)
    let year = getYear(navDate)
    date = new Date(year, month, dayOfMonth)
  }

  function addMonth() {
    navDate = addMonths(navDate, 1)
  }

  function subtractMonth() {
    navDate = subMonths(navDate, 1)
  }

  function openCalendar() {
    instance.open = true
  }

  $: dateMonthEnds = endOfMonth(navDate).getDate()
  $: dateMonthBegins = startOfMonth(navDate).getDay()
  $: dayStart = dateMonthBegins + 1 //1 = sunday
  $: monthAndYear = format(navDate, "MMMM y")
  $: selectedDate = format(date, "dd/MM/yyyy")
  $: dayOfSelectedDate = getDate(date)
  $: for (let d = 1; d <= dateMonthEnds; d++) {
    if (d === 1) {
      daysArr = [d]
    } else {
      daysArr = [...daysArr, d]
    }
  }
  $: rowRepeater =
    dateMonthBegins > 5 && daysArr[daysArr.length - 1] > 30 ? 6 : 5
  $: sameMonthAndYear =
    getMonth(date) === getMonth(navDate) && getYear(date) === getYear(navDate)
  $: console.log(textFieldHeight)
</script>

<!-- 
  TODO: Add transition effects to toggling of calendar
  TODO: Bug - August 2020 has too many rows. find out why
  TODO: Bug - make out transition of date bg colour instantaneous
 -->
<div class="mdc-menu-surface--anchor">
  <Textfield
    bind:tfHeight={textFieldHeight}
    value={selectedDate}
    trailingIcon={true}
    useIconButton={true}
    iconButtonClick={openCalendar}
    icon="calendar_today"
    label="Select Date" />

  <div
    bind:this={menu}
    class="mdc-menu mdc-menu-surface bbmd-menu"
    style={`margin-top: 70px`}>
    <div class="calendar-container">
      <div class="month-picker">
        <div>
          <IconButton icon="chevron_left" onClick={subtractMonth} />
        </div>
        <div class="centreText">
          <Body1 text={monthAndYear} />
        </div>
        <div>
          <IconButton icon="chevron_right" onClick={addMonth} />
        </div>
      </div>
      <div class="week-days">
        {#each weekdayMap as day, i}
          <div class="centreText">
            <Caption text={day} />
          </div>
        {/each}
      </div>
      <div
        class="day-picker"
        style={`grid-template-rows: repeat(${rowRepeater}, 40px)`}>
        {#each daysArr as day, i}
          <div
            use:ripple
            on:click={() => selectDate(day)}
            class={`bbmd-day ${dayOfSelectedDate === day && sameMonthAndYear ? 'selected' : ''}`}>
            {#if i === 0}
              <div style={`grid-column-start: ${dateMonthBegins}`}>
                <Body2 text={day} />
              </div>
            {:else}
              <Body2 text={day} />
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <ul class="mdc-list" role="menu" />
  </div>
</div>

<style>
  .bbmd-menu {
    width: 330px;
    height: auto;
    padding: 5px;
  }

  .month-picker {
    display: grid;
    grid-template-columns: 40px 1fr 40px;
    justify-content: center;
    align-items: center;
  }

  .calendar-container {
    display: grid;
    height: 100%;
    grid-template-rows: repeat(3, auto);
    grid-gap: 5px;
  }

  .calendar-container > div {
    /* border: 1px solid red; */
  }

  .week-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }

  .day-picker {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }

  .centreText {
    text-align: center;
  }

  span {
    margin: auto;
  }
</style>
