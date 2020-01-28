<script>
    import IconButton from "../common/IconButton.svelte";
    import EventSelector from "./EventSelector.svelte";
    import {
        filter
    } from "lodash/fp";
    import {EVENT_TYPE_MEMBER_NAME} from "../common/eventHandlers";

    export let parentProps;
    export let propDef;
    export let onValueChanged;

    $:  events = parentProps[propDef.____name];

    const addHandler = () => {
        const newHandler = {parameters:{}};
        newHandler[EVENT_TYPE_MEMBER_NAME] = "";
        events = [...events, newHandler];
        onValueChanged(events);
    }

    const onEventHandlerChanged = (oldEvent) => (newEvent) => {
        const indexOfOldEvent = events.indexOf(oldEvent);
        const newEvents = [...events];
        newEvents.splice(
            events.indexOf(oldEvent),
            1,
            newEvent);
        events = newEvents;
        onValueChanged(events);
    }

    const removeHandler = (index) => () => {
        events = filter(e => e !== events[index])(events);
        onValueChanged(events);
    }

</script>

<div class="root">
    <div class="control-container">
        {#each events as ev, index}

        <div class="handler-container">
            <EventSelector onChanged={onEventHandlerChanged(ev)}
                        onRemoved={removeHandler(index)}
                        event={ev} />

        </div>

        <div class="separator"></div>
        {/each}

        <div class="addelement-container"
             on:click={addHandler}>
            <IconButton icon="plus"
                            size="12"/>
        </div>
    </div>
</div>


<style>
    .addelement-container {
        cursor: pointer;
        padding: 3px 0px;
        text-align: center;
    }

    .addelement-container:hover {
        background-color: var(--primary25);
        margin-top: 5px;
    }


    .control-container {
        padding-left: 3px;
        background: var(--secondary10);
    }

    .separator {
        width: 60%;
        margin: 10px auto;
        border-style:solid;
        border-width: 1px 0 0 0;
        border-color: var(--primary25);
    }
</style>
