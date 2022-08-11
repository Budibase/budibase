const latinMap = require('./latinMap');

const SAFE_CHARACTERS = /[^0-9a-zA-Z! _\\.\\*'\\(\\)\\\-/]/g;

const isNumber = (value) => typeof value === 'number';

const isString = (value) => Object.prototype.toString.call(value) === '[object String]';

const replaceLatinCharacters = (value) =>
    value.replace(/[^A-Za-z0-9[\] ]/g, (character) => latinMap[character] || character);

const removeIllegalCharacters = (value) => value.replace(SAFE_CHARACTERS, '');

const isValidSeparator = (separator) => separator && !separator.match(SAFE_CHARACTERS);

const sanitize = (objectKey, separator = '-') => {
    if (!isValidSeparator(separator)) {
        throw new Error(`${separator} is not a valid separator`);
    }

    if (!objectKey || !isString(objectKey) && !isNumber(objectKey)) {
        throw new Error(`Expected non-empty string or number, got ${objectKey}`);
    }

    if (isNumber(objectKey)) {
        return objectKey.toString();
    }

    return removeIllegalCharacters(replaceLatinCharacters(objectKey.trim())).replace(/ /g, separator);
};

module.exports = sanitize;
