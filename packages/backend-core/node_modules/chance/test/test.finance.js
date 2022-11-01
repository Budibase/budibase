import test from 'ava'
import Chance from '../chance.js'
import _ from 'lodash'

const chance = new Chance()

// chance.cc()
test('cc() passes the luhn algorithm', t => {
    _.times(1000, () => {
        let number = chance.cc()
        t.true(chance.luhn_check(number))
    })
})

test('cc() can take a type arg and obey it', t => {
    _.times(1000, () => {
        let type = chance.cc_type({ raw: true })
        let number = chance.cc({ type: type.name })
        t.is(number.length, type.length)
    })
})

test('cc() can take a short_name type arg and obey it', t => {
    _.times(1000, () => {
        let type = chance.cc_type({ raw: true })
        let number = chance.cc({ type: type.short_name })
        t.is(number.length, type.length)
    })
})

// chance.cc_type()
test('cc_type() returns a random credit card type', t => {
    _.times(1000, () => {
        t.true(_.isString(chance.cc_type()))
    })
})

test('cc_type() can take a raw arg and obey it', t => {
    _.times(1000, () => {
        let type = chance.cc_type({ raw: true })
        t.truthy(type.name)
        t.truthy(type.short_name)
        t.truthy(type.prefix)
        t.truthy(type.length)
    })
})

test('cc_type() can take a name arg and obey it', t => {
    _.times(1000, () => {
        let type = chance.cc_type({ name: 'Visa', raw: true })
        t.is(type.name, 'Visa')
    })
})

test('cc_type() with bogus type throws', t => {
    const fn = () => chance.cc_type({ name: 'potato' })
    t.throws(fn, 'Chance: Credit card type \'potato\' is not supported')
})

// chance.cc_types()
test('cc_types() returns an array of credit card types', t => {
    t.true(_.isArray(chance.cc_types()))
})

// chance.currency()
test('currency() returns a currency', t => {
    _.times(1000, () => {
        let currency = chance.currency()
        t.true(_.isObject(currency))
        t.truthy(currency.code)
        t.is(currency.code.length, 3)
        t.truthy(currency.name)
    })
})

// chance.currency_pair()
test('currency_pair() returns a currency pair', t => {
    _.times(1000, () => {
        let currency_pair = chance.currency_pair()
        t.true(_.isArray(currency_pair))
        t.is(currency_pair.length, 2)
        t.not(currency_pair[0].code, currency_pair[1].code)
    })
})

test('currency_pair() can return string version', t => {
    _.times(1000, () => {
        let currency_pair = chance.currency_pair(true)
        t.true(_.isString(currency_pair))
        t.is(currency_pair.length, 7)
        t.true(/^[A-Z][A-Z][A-Z]+\/[A-Z][A-Z][A-Z]$/.test(currency_pair))
    })
})

// chance.dollar()
test('dollar() returns a proper dollar amount', t => {
    let dollar = chance.dollar()
    t.true(/\$[0-9]+\.[0-9]+/.test(dollar))
    let dollarFloat = parseFloat(dollar.substring(1, dollar.length))
    t.true(dollarFloat < 10001)
})

test('dollar() obeys min and max, if provided', t => {
    _.times(1000, () => {
        let dollar = chance.dollar({ max: 20 })
        let dollarFloat = parseFloat(dollar.substring(1, dollar.length))
        t.true(dollarFloat <= 20)
    })

    _.times(1000, () => {
        let dollar = chance.dollar({ min: 20 })
        let dollarFloat = parseFloat(dollar.substring(1, dollar.length))
        t.true(dollarFloat >= 20)
    })
})

test('dollar() can take negative min and max', t => {
    _.times(1000, () => {
        let dollar = chance.dollar({ min: -200, max: -1 })
        t.is(dollar.charAt(0), '-')
        let dollarFloat = parseFloat(dollar.substring(2, dollar.length))
        // This is necessary because we strip the - when parsing
        dollarFloat *= -1
        t.true(dollarFloat <= -1)
        t.true(dollarFloat >= -200)
    })
})

// chance.euro()
test('euro() returns a proper euro amount', t => {
    let euro = chance.euro()
    t.true(/[0-9]+,?\.?[0-9]+?€/.test(euro))
    let euroFloat = parseFloat(euro.substring(euro.length, -1))
    t.true(euroFloat < 10001)
})

// chance.exp()
test('exp() looks correct', t => {
    _.times(1000, () => {
        let exp = chance.exp()
        t.true(_.isString(exp))
        t.is(exp.length, 7)
        t.true(/([0-9]{2})\/([0-9]{4})/.test(exp))
    })
})

test('exp() will respect object argument', t => {
    _.times(1000, () => {
        let exp = chance.exp({ raw: true })
        t.true(_.isObject(exp))
        t.truthy(exp.month)
        t.true(_.isString(exp.month))
        t.truthy(exp.year)
        t.true(_.isString(exp.year))
    })
})

test('exp() returs a valid credit card expiration (in a future date)', t => {
    _.times(1000, () => {
        let exp = chance.exp({ raw: true })
        let now = new Date()
        let nowMonth = now.getMonth() + 1
        let nowYear = now.getFullYear()
        let expMonth = parseInt(exp.month, 10)
        let expYear = parseInt(exp.year, 10)

        t.true(expYear >= nowYear)
        if (expYear === nowYear) {
            t.true(expMonth >= nowMonth)
        }
    })
})

// chance.exp_month()
test('exp_month() returns a numeric month with leading 0', t => {
    _.times(1000, () => {
        let month = chance.exp_month()
        t.true(_.isString(month))
        t.is(month.length, 2)
    })
})

// chance.exp_year()
test('exp_year() returns an expiration year', t => {
    _.times(1000, () => {
        let year = chance.exp_year()
        t.true(_.isString(year))
        let parsedYear = parseInt(year, 10)
        let curYear = new Date().getFullYear()
        t.true(parsedYear >= curYear)
        t.true(parsedYear <= curYear + 10)
    })
})

test('exp_month() will return a future month if requested', t => {
    _.times(1000, () => {
        let nowMonth = new Date().getMonth() + 1
        let expMonth = parseInt(chance.exp_month({ future: true }), 10)
        if (nowMonth !== 12) {
            t.true(expMonth > nowMonth)
        } else {
            t.true(expMonth >= 1)
            t.true(expMonth <= 12)
        }
    })
})

// chance.luhn_check()
test('luhn_check() properly checks if number passes the Luhn algorithm', t => {
    t.true(chance.luhn_check(49927398716))
    t.true(chance.luhn_check(1234567812345670))
    t.false(chance.luhn_check(49927398717))
    t.false(chance.luhn_check(1234567812345678))
})

test('iban() returns an iban', t => {
    let iban = chance.iban()
    t.true(_.isString(iban))
    t.true(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{1,26}$/.test(iban))
})
