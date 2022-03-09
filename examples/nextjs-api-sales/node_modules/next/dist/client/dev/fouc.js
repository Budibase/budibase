"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.displayContent = displayContent;
function displayContent() {
    return new Promise((resolve)=>{
        (window.requestAnimationFrame || setTimeout)(function() {
            for(var x = document.querySelectorAll('[data-next-hide-fouc]'), i = x.length; i--;){
                x[i].parentNode.removeChild(x[i]);
            }
            resolve();
        });
    });
}

//# sourceMappingURL=fouc.js.map