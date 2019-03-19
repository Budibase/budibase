import {map} from "lodash";

export const action = (name, run, iterator=iterateActionTimes(1)) => ({name, run, iterator});

export const iterateActionTimes = times => run => 
    map([...Array(times).keys()], run);

export const iterateCollection = getCollection => run =>
    map(getCollection(), run);