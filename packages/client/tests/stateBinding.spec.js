import {
    setupBinding
} from "../src/state/stateBinding";
import {
    BB_STATE_BINDINGPATH,
    BB_STATE_FALLBACK,
    BB_STATE_BINDINGSOURCE
} from "../src/state/isState";
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

    it("should update bound array props when updated ", () => {

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
            s.addressToSet = "123 Main Street";
            s.ArrayVal1 = "item 1 - version 1";
            s.ArrayVal2 = "item 2 - version 1";
            s.ArrayVal3 = "inner array item";
            return s;
        });

        expect(component.props.arrayWithInnerBinding[0].innerBound).toBe("item 1 - version 1");
        expect(component.props.arrayWithInnerBinding[1].innerBound).toBe("item 2 - version 1");
        expect(component.props.arrayWithInnerBinding[0].innerUnbound).toBe("not bound 1");
        expect(component.props.arrayWithInnerBinding[1].innerUnbound).toBe("not bound 2");

    });

    it("should update bound nested (2nd level) array props when updated ", () => {

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
            s.addressToSet = "123 Main Street";
            s.ArrayVal1 = "item 1 - version 1";
            s.ArrayVal2 = "item 2 - version 1";
            s.ArrayVal3 = "inner array item";
            return s;
        });

        expect(component.props.arrayWithInnerBinding[2].innerArray[0].innerInnerBound).toBe("inner array item");

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

    it("event handlers should recognise event parameter", () => {

        const {component, store, props} = testSetup();

        const {bind} = testSetupBinding(store, props, component);
        bind(component);
        
        expect(component.props.boundToEventOutput).toBe("initial address");
        component.props.eventBoundUsingEventParam({addressOverride: "Overridden Address"});
        expect(component.props.boundToEventOutput).toBe("Overridden Address");
        
        store.update(s => {
            s.addressToSet = "123 Main Street"
            return s;
        });

        component.props.eventBound();
        expect(component.props.boundToEventOutput).toBe("123 Main Street");

        component.props.eventBoundUsingEventParam({addressOverride: "Overridden Address"});
        expect(component.props.boundToEventOutput).toBe("Overridden Address");

    });

    it("should bind initial props to supplied context", () => {

        const {component, store, props} = testSetup();

        const {bind} = testSetupBinding(store, props, component, {
            ContextValue : "Real Context Value"
        });
        bind(component);

        expect(component.props.boundToContext).toBe("Real Context Value");

    });

});
const testSetupBinding = (store, props, component, context) => {
    const setup = setupBinding(store, props, undefined, context);
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


    const binding = (path, fallback, source) => {
        const b = {};
        b[BB_STATE_BINDINGPATH] = path;
        b[BB_STATE_FALLBACK] = fallback;
        b[BB_STATE_BINDINGSOURCE] = source || "store";
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
        boundToContext: binding("ContextValue", "context fallback", "context"),
        eventBound: [
            event("Set State", {
                path: "Customer.Address",
                value: binding("addressToSet", "event fallback address")
            })
        ],
        eventBoundUsingEventParam: [
            event("Set State", {
                path: "Customer.Address",
                value: binding("addressOverride", "", "event")
            })
        ],
        arrayWithInnerBinding: [
            {
                innerBound: binding("ArrayVal1"),
                innerUnbound: "not bound 1"
            },
            {
                innerBound: binding("ArrayVal2"),
                innerUnbound: "not bound 2"
            },
            {
                innerArray: [
                    {
                        innerInnerBound: binding("ArrayVal3")
                    }
                ]
            }
        ]
    }

    return {
        component:c, 
        store:writable({}),
        props
    };
}

