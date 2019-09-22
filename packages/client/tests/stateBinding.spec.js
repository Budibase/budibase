import {
    setupBinding,
    BB_STATE_BINDINGPATH,
    BB_STATE_FALLBACK
} from "../src/state/stateBinding";
import { EVENT_TYPE_MEMBER_NAME } from "../src/state/eventHandlers";
import {writable} from "svelte/store";
import { isFunction } from "lodash/fp";

describe("setupBinding", () => {


    it("should correctly create initials props, including fallback values", () => {

        const {store, props, component} = testSetup();

        const {initialProps} = testSetupBinding(store, props, component);

        expect(initialProps.boundWithFallback).toBe("Bob");
        expect(initialProps.boundNoFallback).toBeUndefined();
        expect(initialProps.unbound).toBe("hello");

        expect(isFunction(initialProps.eventBound)).toBeTruthy();
        initialProps.eventBound();        

    });

    it("should update component bound props when store is updated", () => {

        const {component, store, props} = testSetup();

        const {bind} = testSetupBinding(store, props, component);
        bind(component);

        store.update(s => {
            s.FirstName = "Bobby";
            s.LastName = "Thedog";
            s.Customer = {
                Name: "ACME inc",
                Address: ""
            };
            s.addressToSet = "123 Main Street"
            return s;
        });

        expect(component.props.boundWithFallback).toBe("Bobby");
        expect(component.props.boundNoFallback).toBe("Thedog");
        expect(component.props.multiPartBound).toBe("ACME inc");

    });

    it("should not update unbound props when store is updated", () => {

        const {component, store, props} = testSetup();

        const {bind} = testSetupBinding(store, props, component);
        bind(component);

        store.update(s => {
            s.FirstName = "Bobby";
            s.LastName = "Thedog";
            s.Customer = {
                Name: "ACME inc",
                Address: ""
            };
            s.addressToSet = "123 Main Street"
            return s;
        });

        expect(component.props.unbound).toBe("hello");

    });

    it("should update event handlers on state change", () => {

        const {component, store, props} = testSetup();

        const {bind} = testSetupBinding(store, props, component);
        bind(component);
        
        expect(component.props.boundToEventOutput).toBe("initial address");
        component.props.eventBound();
        expect(component.props.boundToEventOutput).toBe("event fallback address");
        
        store.update(s => {
            s.addressToSet = "123 Main Street"
            return s;
        });

        component.props.eventBound();
        expect(component.props.boundToEventOutput).toBe("123 Main Street");

    });

});
const testSetupBinding = (store, props, component) => {
    const setup = setupBinding(store, props);
    component.props = setup.initialProps; // svelte does this for us in real life
    return setup;
}
const testSetup = () => {

    const c = {};

    c.props = {};
    c.$set = propsToSet => {
        for(let pname in propsToSet)
            c.props[pname] = propsToSet[pname];
    }


    const binding = (path, fallback) => {
        const b = {};
        b[BB_STATE_BINDINGPATH] = path;
        b[BB_STATE_FALLBACK] = fallback;
        return b;
    };

    const event = (handlerType, parameters) => {
        const e = {};
        e[EVENT_TYPE_MEMBER_NAME] = handlerType;
        e.parameters = parameters;
        return e;
    }

    const props = {
        boundWithFallback : binding("FirstName", "Bob"),
        boundNoFallback : binding("LastName"),
        unbound: "hello",
        multiPartBound: binding("Customer.Name", "ACME"),
        boundToEventOutput: binding("Customer.Address", "initial address"),
        eventBound: [
            event("Set State", {
                path: "Customer.Address",
                value: binding("addressToSet", "event fallback address")
            })
        ]
    }

    return {
        component:c, 
        store:writable({}),
        props
    };
}

