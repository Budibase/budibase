export const pad = (number, length = 2) => `000${number}`.slice(length * -1);
export const int = (bool) => (bool === true ? 1 : 0);
export function debounce(fn, wait) {
    let t;
    return function () {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, arguments), wait);
    };
}
export const arrayify = (obj) => obj instanceof Array ? obj : [obj];
