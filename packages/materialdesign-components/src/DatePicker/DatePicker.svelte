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

  let menu
  let instance
  let textfieldValue = ""

  let daysArr = []
  let navDate = new Date()
  const weekdayMap = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  export let date = new Date()
  export let label = ""
  export let onSelect = selectedDate => {}

  onMount(() => {
    if (!!menu) {
      instance = new MDCMenu(menu)
      instance.open = false
      instance.setFixedPostion = true
    }
  })

  function selectDate(dayOfMonth) {
    let month = getMonth(navDate)
    let year = getYear(navDate)
    date = new Date(year, month, dayOfMonth)
    onSelect(date)
  }

  function addMonth() {
    navDate = addMonths(navDate, 1)
  }

  function subtractMonth() {
    navDate = subMonths(navDate, 1)
  }

  function openCalendar(isOpen) {
    instance.open = isOpen === undefined ? !instance.open : isOpen
  }

  function textFieldChange(value) {
    const isDate = /^\d{1,2}\/\d{1,2}\/\d{4}$/
    if (isDate.test(value)) {
      const [year, month, day] = value.split("/").reverse()
      if (month > 0 && month <= 12 && (day > 0 && day <= 31)) {
        date = new Date(year, month - 1, day)
        navDate = date
        openCalendar(true)
        onSelect(date)
      }
    }
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
</script>

<div class="mdc-menu-surface--anchor">
  <Textfield
    {label}
    onChange={textFieldChange}
    value={selectedDate}
    trailingIcon={true}
    useIconButton={true}
    iconButtonClick={openCalendar}
    icon="calendar_today" />

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
            style={i === 0 ? `grid-column-start: ${dayStart}` : ``}
            on:click={() => selectDate(day)}
            class={`bbmd-day ${dayOfSelectedDate === day && sameMonthAndYear ? 'selected' : ''}`}>
            <Body2 text={day} />
          </div>
        {/each}
      </div>
    </div>

    <!-- Superfluous but necessary to keep the menu instance sweet -->
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
</style>
