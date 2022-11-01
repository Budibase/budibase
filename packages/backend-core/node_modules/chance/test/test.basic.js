import test from 'ava'
import Chance from '../chance.js'
import _ from 'lodash'

const chance = new Chance()

const timeout = (seconds) => {
    new Promise((resolve, reject) => {
        setTimeout(() => resolve(), seconds)
    })
}

test('bool() returns a random boolean', t => {
    let bool = chance.bool()
    t.is(typeof bool, 'boolean')
})

test('bool() is within the bounds of what we would call random', t => {
    let trueCount = 0;
    _.times(1000, () => {
        if (chance.bool()) {
            trueCount++
        }
    })

    // The probability of this test failing is approximately 4.09e-86.
    // So, in theory, it could give a false negative, but the sun will
    // probably die long before that happens.

    t.true((trueCount > 200) && (trueCount < 800))
})

test('bool() takes and obeys likelihood', t => {
    let trueCount = 0
    _.times(1000, () => {
        if (chance.bool({ likelihood: 30 })) {
            trueCount++
        }
    })

    // Expect it to average around 300
    t.true((trueCount > 200) && (trueCount < 400))

    trueCount = 0
    _.times(1000, () => {
        if (chance.bool({ likelihood: 99 })) {
            trueCount++
        }
    })

    // Expect it to average at 990
    t.true(trueCount > 900)
})

test('bool() throws an error if likelihood < 0 or > 100', t => {
    const fn1 = () => chance.bool({likelihood: -23})
    t.throws(fn1, RangeError)
    const fn2 = () => chance.bool({likelihood: 7933})
    t.throws(fn2, RangeError)
})

test('Chance() null works', async t => {
    t.plan(1)

    let chance1 = Chance(null)
    // Wait 5 ms before creating chance2 else sometimes they happen on the same
    // tick and end up with the same seed!
    await timeout(5)
    let chance2 = Chance(null)
    t.not(chance1.random(), chance2.random())
})

test('Chance() does return differing results if differing seeds provided', t => {
    let chance1 = new Chance(12345)
    let chance2 = new Chance(54321)
    t.not(chance1.random(), chance2.random())
})

test('Chance() does not return repeatable results if no seed provided', async t => {
    t.plan(1000)
    let chance1 = new Chance()
    await timeout(5)
    let chance2 = new Chance()
    _.times(1000, () => {
        t.not(chance1.random(), chance2.random())
    })
})

test('Chance() returns repeatable results if seed provided on the Chance object', t => {
    let seed = new Date().getTime()
    let chance1 = new Chance(seed)
    let chance2 = new Chance(seed)

    _.times(1000, () => {
        t.is(chance1.random(), chance2.random())
    })
})

test('Chance() returns repeatable results if a string is provided as a seed', t => {
    let seed = "foo"
    let chance1 = new Chance(seed)
    let chance2 = new Chance(seed)

    _.times(1000, () => {
        t.is(chance1.random(), chance2.random())
    })
})

test('Chance() returns different results if two different strings are provided', t => {
    let chance1 = new Chance("foo")
    let chance2 = new Chance("baz")

    _.times(1000, () => {
        t.not(chance1.random(), chance2.random())
    })
})

test('Chance() returns different results if two different strings are provided redux', t => {
    // Credit to @dan-tilley for noticing this flaw in the old seed
    let chance1 = new Chance("abe")
    let chance2 = new Chance("acc")

    _.times(1000, () => {
        t.not(chance1.random(), chance2.random())
    })
})

test('Chance() returns different results if multiple arguments are provided', t => {
    let seed = new Date().getTime()
    let chance1 = new Chance(seed, "foo")
    let chance2 = new Chance(seed, "bar")

    _.times(1000, () => {
        t.not(chance1.random(), chance2.random())
    })
})

test('Chance() will take an arbitrary function for the seed and use it', t => {
    let chance = new Chance(() => 123)

    _.times(1000, () => {
        t.is(chance.random(), 123)
    })
})

test('character() returns a character', t => {
    let char = chance.character()
    t.is(typeof char, 'string')
    t.is(char.length, 1)
})

test('character() pulls only from pool, when specified', t => {
    _.times(1000, () => {
        let char = chance.character({ pool: 'abcde' })
        t.true(/[abcde]/.test(char))
    })
})

test('character() allows only alpha', t => {
    _.times(1000, () => {
        let char = chance.character({ alpha: true })
        t.true(/[a-zA-Z]/.test(char))
    })
})

test('character() allows only alphanumeric', t => {
    _.times(1000, () => {
        let char = chance.character({ alpha: true, numeric: true })
        t.true(/[a-zA-Z0-9]/.test(char))
    })
})

test('character() obeys upper case', t => {
    _.times(1000, () => {
        let char = chance.character({ alpha: true, casing: 'upper' })
        t.true(/[A-Z]/.test(char))
    })
})

test('character() obeys lower case', t => {
    _.times(1000, () => {
        let char = chance.character({ alpha: true, casing: 'lower' })
        t.true(/[a-z]/.test(char))
    })
})

test('floating() returns a random floating', t => {
    t.is(typeof chance.floating(), 'number')
})

test('floating() can take both a max and min and obey them both', t => {
    _.times(1000, () => {
        let floating = chance.floating({ min: 90, max: 100 })
        t.true(floating > 89)
        t.true(floating < 101)
    })
})

test('floating() will not take fixed + min that would be out of range', t => {
    const fn = () => chance.floating({ fixed: 13, min: -9007199254740992 })
    t.throws(fn, "Chance: Min specified is out of range with fixed. Min should be, at least, -900.7199254740992")
})

test('floating() will not take fixed + max that would be out of range', t => {
    const fn = () => chance.floating({ fixed: 13, max: 9007199254740992 })
    t.throws(fn, "Chance: Max specified is out of range with fixed. Max should be, at most, 900.7199254740992")
})

test('floating() obeys the fixed parameter, when present', t => {
    _.times(1000, () => {
        let floating = chance.floating({ fixed: 4 })
        let decimals = floating.toString().split('.')[1] ? floating.toString().split('.')[1] : ''
        t.true(decimals.length < 5)
    })
})

test('floating() can take fixed and obey it', t => {
    _.times(1000, () => {
        let floating = chance.floating({ fixed: 3 })
        let parsed = parseFloat(floating.toFixed(3))
        t.is(floating, parsed)
    })
})

test('floating() will not take both fixed and precision', t => {
    const fn = () => chance.floating({fixed: 2, precision: 8})
    t.throws(fn, 'Chance: Cannot specify both fixed and precision.')
})

test('get() works as expected', t => {
    let data = chance.get('lastNames')
    t.true(typeof data === 'object')
})

test('hex() works as expected', t => {
    _.times(1000, () => {
        t.true(/[0-9a-f]/.test(chance.hex()))
    })
})

test('hex() can take Upper and obey it', t => {
    _.times(1000, () => {
        t.true(/[0-9A-F]/.test(chance.hex({ casing: 'upper' })))
    })
})

test('integer() returns a random integer', t => {
    t.is(typeof chance.integer(), 'number')
})

test('integer() is sometimes negative, sometimes positive', t => {
    let positiveCount = 0
    _.times(1000, () => {
        if (chance.integer() > 0) {
            positiveCount++
        }
    })

    // Note: In very extreme circumstances this test may fail as, by its
    // nature it's random. But it's a low enough percentage that I'm
    // willing to accept it.
    t.true((positiveCount > 200) && (positiveCount < 800))
})

test('integer() can take a zero min and obey it', t => {
    _.times(1000, () => {
        t.true(chance.integer({ min: 0 }) > 0)
    })
})

test('integer() can take a negative min and obey it', t => {
    _.times(1000, () => {
        t.true(chance.integer({ min: -25 }) > -26)
    })
})

test('integer() can take a negative min and max and obey both', t => {
    _.times(1000, () => {
        let integer = chance.integer({ min: -25, max: -1 })
        t.true((integer > -26) && integer < 0)
    })
})

test('integer() can take a min with absolute value less than max and return in range above', t => {
    let count = 0
    _.times(1000, () => {
        // With a range this large we'd expect most values to be
        // greater than 1 if this works correctly.
        if (Math.abs(chance.integer({ min: -1, max: 1000000 })) < 2) {
            count++
        }
    })
    t.true(count < 900)
})

test('integer() throws an error when min > max', t => {
    const fn = () => chance.integer({ min: 1000, max: 500 })
    t.throws(fn, 'Chance: Min cannot be greater than Max.')
})

test('letter() returns a letter', t => {
    _.times(1000, () => {
        let letter = chance.letter()
        t.is(typeof letter, 'string')
        t.is(letter.length, 1)
        t.true(letter.match(/[a-z]/) !== null)
    })
})

test('letter() can take upper case', t => {
    _.times(1000, () => {
        let letter = chance.letter({ casing: 'upper' })
        t.is(typeof letter, 'string')
        t.is(letter.length, 1)
        t.true(letter.match(/[A-Z]/) !== null)
    })
})

test('natural() returns a random natural', t => {
    t.is(typeof chance.natural(), 'number')
})

test('natural() throws an error if min < 0', t => {
    const fn = () => chance.natural({ min: -23 })
    t.throws(fn, 'Chance: Min cannot be less than zero.')
})

test('natural() is always positive or zero', t => {
    let positiveCount = 0
    _.times(1000, () => {
        if (chance.natural() >= 0) {
            positiveCount++
        }
    })
    t.is(positiveCount, 1000)
})

test('natural() can take just a min and obey it', t => {
    _.times(1000, () => {
        t.true(chance.natural({ min: 9007199254740991 }) > 9007199254740990)
    })
})

test('natural() can take just a max and obey it', t => {
    _.times(1000, () => {
        t.true(chance.natural({ max: 100 }) < 101)
    })
})

test('natural() can take both a max and min and obey them both', t => {
    _.times(1000, () => {
        let natural = chance.natural({ min: 90, max: 100 })
        t.true(natural > 89)
        t.true(natural < 101)
    })
})

test('natural() works with both bounds 0', t => {
    _.times(1000, () => {
        t.is(chance.natural({ min: 0, max: 0 }), 0)
    })
})

test('natural() respects numerals', t => {
    _.times(1000, () => {
        let natural = chance.natural({ numerals: 2 })
        t.true(natural <= 99)
        t.true(natural >= 10)
    })
})

test('natural() works with excluded numbers', t => {
    _.times(1000, () => {
        let natural = chance.natural({ min: 1, max: 5, exclude: [1, 3] })
        t.true(natural <= 5)
        t.true(natural >= 1)
        t.true(natural !== 1)
        t.true(natural !== 3)
    })
})

test('natural() works within empty exclude option', t => {
    _.times(1000, () => {
        let natural = chance.natural({ min: 1, max: 5, exclude: [] })
        t.true(natural <= 5)
        t.true(natural >= 1)
    })
})

test('natural() throws an error if exclude is not an array', t => {
    const fn = () => chance.natural({ min: 1, max: 5, exclude: "foo" })
    t.throws(fn, 'Chance: exclude must be an array.')
})

test('natural() throws an error if exclude is not an array', t => {
    const fn = () => chance.natural({ min: 1, max: 5, exclude: ["puppies", 1] })
    t.throws(fn, 'Chance: exclude must be numbers.')
})

test('natural() throws an error if min > max', t => {
    const fn = () => chance.natural({ min: 1000, max: 500 })
    t.throws(fn, 'Chance: Min cannot be greater than Max.')
})

test('natural() throws an error if numerals is less than 1', t => {
    const fn = () => chance.natural({ numerals: 0 })
    t.throws(fn, 'Chance: Numerals cannot be less than one.')
})

test('prime() returns a number', t => {
    t.is(typeof chance.prime(), 'number')
})

test('prime() throws an error if min < 0', t => {
    const fn = () => chance.prime({ min: -23 })
    t.throws(fn, 'Chance: Min cannot be less than zero.')
})

test('prime() throws an error if min > max', t => {
    const fn = () => chance.prime({ min: 1000, max: 500 })
    t.throws(fn, 'Chance: Min cannot be greater than Max.')
})

test('prime() is always positive and odd (or 2)', t => {
    let positiveCount = 0
    _.times(1000, () => {
        const prime = chance.prime()
        if (prime > 0 && (prime % 2 === 1 || prime === 2)) {
            positiveCount++
        }
    })
    t.is(positiveCount, 1000)
})

test('prime() can take just a min and obey it', t => {
    _.times(1000, () => {
        t.true(chance.prime({ min: 5000 }) >= 5000)
    })
})

test('prime() can take just a max and obey it', t => {
    _.times(1000, () => {
        t.true(chance.prime({ max: 20000 }) <= 20000)
    })
})

test('prime() can take both a max and min and obey them both', t => {
    _.times(1000, () => {
        const prime = chance.prime({ min: 90, max: 100 })
        t.true(prime >= 90)
        t.true(prime <= 100)
    })
})

test('set() works as expected', t => {
    let cData = { lastNames: ['customName', 'testLast'] }
    chance.set(cData)
    let data = chance.get('lastNames')
    t.true(_.isArray(data))
    t.is(data.length, 2)
})

test('string() returns a string', t => {
    t.is(typeof chance.string(), 'string')
})

test('string() obeys length, when specified', t => {
    _.times(1000, () => {
        let length = chance.natural({ min: 1, max: 25 })
        t.is(chance.string({ length: length }).length, length)
    })
})

test('string() throws error if length < 0', t => {
    const fn = () => chance.string({ length: -23 })
    t.throws(fn, 'Chance: Length cannot be less than zero.')
})

test('string() returns only letters with alpha', t => {
    _.times(1000, () => {
        let str = chance.string({ alpha: true })
        t.true(/[a-zA-Z]+/.test(str))
    })
})

test('string() obeys upper case', t => {
    _.times(1000, () => {
        let str = chance.string({ alpha: true, casing: 'upper' })
        t.true(/[A-Z]+/.test(str))
    })
})

test('string() obeys lower case', t => {
    _.times(1000, () => {
        let str = chance.string({ alpha: true, casing: 'lower' })
        t.true(/[a-z]+/.test(str))
    })
})

test('string() obeys symbol', t => {
    _.times(1000, () => {
        let str = chance.string({ symbols: true })
        t.true(/[\!\@\#\$\%\^\&\*\(\)\[\]]+/.test(str))
    })
})

test('string() can take just a min and obey it', t => {
    _.times(1000, () => {
        t.true(chance.string({ min: 6 }).length >= 6)
    })
})

test('string() can take just a max and obey it', t => {
    _.times(1000, () => {
        t.true(chance.string({ max: 20 }).length <= 20)
    })
})

test('falsy() should return a falsy value', t => {
    _.times(1000, () => {
        const value = chance.falsy()
        t.falsy(value)
    })
})

test('falsy() should return a falsy value using a pool data', t => {
    _.times(1000, () => {
        const value = chance.falsy({pool: [null, undefined]})
        t.falsy(value)
    })
})

test('template() returns alpha numeric substituted', t => {
    _.times(1000, () => {
        let str = chance.template('ID-{Aa}-{##}')
        t.regex(str, /^ID-[A-Z][a-z]-[0-9][0-9]$/)
    })
})

test('template() rejects unknown tokens', t => {
    t.throws(() => chance.template('{Aa-}'), 'Invalid replacement character: "-".')
    t.throws(() => chance.template('{Aa{}'), 'Invalid replacement character: "{".')
    t.throws(() => chance.template('{Aab}'), 'Invalid replacement character: "b".')
})

test('template() allows escape sequnce', t => {
    t.is(chance.template('\\\\ID-\\{Aa\\}'), '\\ID-{Aa}')
})

test('template() rejects invalid escape sequnce', t => {
    t.throws(() => chance.template('ID-\\Aa'), 'Invalid escape sequence: "\\A".')
})

test('template() cannot be undefined', t => {
    t.throws(() => chance.template(), 'Template string is required')
})

test('template() cannot be empty', t => {
    t.throws(() => chance.template(''), 'Template string is required')
})
