export const iifeWrapper = (script: string) => {
  return `(function(){\n${script}\n})();`
}
