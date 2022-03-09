"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isEqualNode = isEqualNode;
exports.default = initHeadManager;
exports.DOMAttributeNames = void 0;
const DOMAttributeNames = {
    acceptCharset: 'accept-charset',
    className: 'class',
    htmlFor: 'for',
    httpEquiv: 'http-equiv',
    noModule: 'noModule'
};
exports.DOMAttributeNames = DOMAttributeNames;
function reactElementToDOM({ type , props  }) {
    const el = document.createElement(type);
    for(const p in props){
        if (!props.hasOwnProperty(p)) continue;
        if (p === 'children' || p === 'dangerouslySetInnerHTML') continue;
        // we don't render undefined props to the DOM
        if (props[p] === undefined) continue;
        const attr = DOMAttributeNames[p] || p.toLowerCase();
        if (type === 'script' && (attr === 'async' || attr === 'defer' || attr === 'noModule')) {
            el[attr] = !!props[p];
        } else {
            el.setAttribute(attr, props[p]);
        }
    }
    const { children , dangerouslySetInnerHTML  } = props;
    if (dangerouslySetInnerHTML) {
        el.innerHTML = dangerouslySetInnerHTML.__html || '';
    } else if (children) {
        el.textContent = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
    }
    return el;
}
function isEqualNode(oldTag, newTag) {
    if (oldTag instanceof HTMLElement && newTag instanceof HTMLElement) {
        const nonce = newTag.getAttribute('nonce');
        // Only strip the nonce if `oldTag` has had it stripped. An element's nonce attribute will not
        // be stripped if there is no content security policy response header that includes a nonce.
        if (nonce && !oldTag.getAttribute('nonce')) {
            const cloneTag = newTag.cloneNode(true);
            cloneTag.setAttribute('nonce', '');
            cloneTag.nonce = nonce;
            return nonce === oldTag.nonce && oldTag.isEqualNode(cloneTag);
        }
    }
    return oldTag.isEqualNode(newTag);
}
function updateElements(type, components) {
    const headEl = document.getElementsByTagName('head')[0];
    const headCountEl = headEl.querySelector('meta[name=next-head-count]');
    if (process.env.NODE_ENV !== 'production') {
        if (!headCountEl) {
            console.error('Warning: next-head-count is missing. https://nextjs.org/docs/messages/next-head-count-missing');
            return;
        }
    }
    const headCount = Number(headCountEl.content);
    const oldTags = [];
    for(let i = 0, j = headCountEl.previousElementSibling; i < headCount; i++, j = (j === null || j === void 0 ? void 0 : j.previousElementSibling) || null){
        var ref;
        if ((j === null || j === void 0 ? void 0 : (ref = j.tagName) === null || ref === void 0 ? void 0 : ref.toLowerCase()) === type) {
            oldTags.push(j);
        }
    }
    const newTags = components.map(reactElementToDOM).filter((newTag)=>{
        for(let k = 0, len = oldTags.length; k < len; k++){
            const oldTag = oldTags[k];
            if (isEqualNode(oldTag, newTag)) {
                oldTags.splice(k, 1);
                return false;
            }
        }
        return true;
    });
    oldTags.forEach((t)=>{
        var ref;
        return (ref = t.parentNode) === null || ref === void 0 ? void 0 : ref.removeChild(t);
    });
    newTags.forEach((t)=>headEl.insertBefore(t, headCountEl)
    );
    headCountEl.content = (headCount - oldTags.length + newTags.length).toString();
}
function initHeadManager() {
    let updatePromise = null;
    return {
        mountedInstances: new Set(),
        updateHead: (head)=>{
            const promise = updatePromise = Promise.resolve().then(()=>{
                if (promise !== updatePromise) return;
                updatePromise = null;
                const tags = {
                };
                head.forEach((h)=>{
                    if (// If the font tag is loaded only on client navigation
                    // it won't be inlined. In this case revert to the original behavior
                    h.type === 'link' && h.props['data-optimized-fonts']) {
                        if (document.querySelector(`style[data-href="${h.props['data-href']}"]`)) {
                            return;
                        } else {
                            h.props.href = h.props['data-href'];
                            h.props['data-href'] = undefined;
                        }
                    }
                    const components = tags[h.type] || [];
                    components.push(h);
                    tags[h.type] = components;
                });
                const titleComponent = tags.title ? tags.title[0] : null;
                let title = '';
                if (titleComponent) {
                    const { children  } = titleComponent.props;
                    title = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
                }
                if (title !== document.title) document.title = title;
                [
                    'meta',
                    'base',
                    'link',
                    'style',
                    'script'
                ].forEach((type)=>{
                    updateElements(type, tags[type] || []);
                });
            });
        }
    };
}

//# sourceMappingURL=head-manager.js.map