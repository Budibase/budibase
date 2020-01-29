import { JSDOM } from "jsdom";
import { loadBudibase } from "../src/index";

export const load = async (props) => {
    const dom = new JSDOM(`<!DOCTYPE html><html><body></body><html>`);
    autoAssignIds(props);
    setAppDef(dom.window, props);
    const app = await loadBudibase({
        componentLibraries: allLibs(dom.window), 
        window: dom.window,
        localStorage: createLocalStorage(),
        props,
        uiFunctions
    });
    return {dom, app};
}

// this happens for real by the builder... 
// ..this only assigns _ids when missing
const autoAssignIds = (props, count=0) => {
    if(!props._id) {
        props._id = `auto_id_${count}`;
    }
    if(props._children) {
        for(let child of props._children) {
            count += 1;
            autoAssignIds(child, count);
        }
    }
} 

const setAppDef = (window, props) => {
    window["##BUDIBASE_APPDEFINITION##"] = ({
        componentLibraries: [],
        props,
        hierarchy: {},
        appRootPath: ""
    });
}

const allLibs = (window) => ({
    testlib: maketestlib(window)
});

const createLocalStorage = () => {
    const data = {};
    return ({
        getItem: key => data[key],
        setItem: (key, value) => data[key] = value
    });
}

const maketestlib = (window) => ({
    div: function(opts) {

        const node = window.document.createElement("DIV");
        const defaultChild = window.document.createElement("DIV");
        defaultChild.className = "default-child";
        node.appendChild(defaultChild);

        let currentProps = {...opts.props};
        let childNodes = [];
    
        const set = (props) => { 
            currentProps = Object.assign(currentProps, props);
            node.className = currentProps.className || "";
            if(currentProps._children && currentProps._children.length > 0) {
                if(currentProps.append) { 
                    for(let c of childNodes) {
                        node.removeChild(c);
                    }
                    const components = currentProps._bb.appendChildren(currentProps._children, node);
                    childNodes = components.map(c => c.component._element);
                } else {
                    currentProps._bb.hydrateChildren(currentProps._children, node);
                }
            }
        }
    
        this.$set = set;
        this._element = node;
        set(opts.props);
        opts.target.appendChild(node);
    },
    
    h1: function(opts) {
    
        const node = window.document.createElement("H1");
    
        let currentProps = {...opts.props};

        const set = (props) => {
            currentProps = Object.assign(currentProps, props);
            if(currentProps.text) {
                node.innerText = currentProps.text;
            }
        }
    
        this.$set = set;
        this._element = node;
        set(opts.props);
        opts.target.appendChild(node);
    }
});

const uiFunctions = ({

    never_render : (render, parentContext) => {},

    always_render : (render, parentContext) => {
        render();
    },

    three_clones : (render, parentContext) => {
        for(let i = 0; i<3; i++) {
            render();
        }
    }
});

