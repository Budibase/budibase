const sanitize = require('./index');

test('trying to sanitize values that are not strings, not numbers or empty strings results in an error', () => {
    expect(() => sanitize(null)).toThrow();
    expect(() => sanitize(undefined)).toThrow();
    expect(() => sanitize(NaN)).toThrow();
    expect(() => sanitize('')).toThrow();
    expect(() => sanitize({})).toThrow();
    expect(() => sanitize([])).toThrow();
    expect(() => sanitize([2])).toThrow();
});

test('valid object keys should remain the same', () => {
    const objectKey = 'my.great_photos-2014/jan/myvacation.jpg';
    expect(sanitize(objectKey)).toBe(objectKey);
});

test('spaces are removed', () => {
    const objectKey = '   my.great_photos 2014/jan/myvacation.jpg    ';
    expect(sanitize(objectKey)).toBe('my.great_photos-2014/jan/myvacation.jpg');
});

test('numbers should be converted to strings', () => {
    expect(sanitize(123)).toBe('123');
    expect(sanitize(Number(123))).toBe('123');
});

test('"123#@%$^&@456!-)+=*_" should be sanitized to "123456!-)*_"', () =>
    expect(sanitize('123#@%$^&@456!-)+=*_')).toBe('123456!-)*_'));

test('"áêīòü" should be sanitized to "aeiou"', () => expect(sanitize('áêīòü')).toBe('aeiou'));

test('spaces are replaced with the provided separator or the default', () => {
    expect(sanitize('test test test')).toBe('test-test-test');
    expect(sanitize('test test test', '/')).toBe('test/test/test');
});

test('an error is thrown if the requested separator is not valid', () => {
    expect(() => sanitize('test test test', '|')).toThrow();
    expect(() => sanitize('test test test', null)).toThrow();
    expect(() => sanitize('test test test', '~')).toThrow();
});
