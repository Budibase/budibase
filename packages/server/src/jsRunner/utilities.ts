export function iifeWrapper(script: string) {
  return `(function(){\n${script}\n})();`
}
