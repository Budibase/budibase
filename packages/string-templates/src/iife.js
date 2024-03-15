module.exports.iifeWrapper = script => {
  return `(function(){\n${script}\n})();`
}
