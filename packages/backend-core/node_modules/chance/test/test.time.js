import test from 'ava'
import Chance from '../chance.js'
import _ from 'lodash'

const chance = new Chance()

// chance.ampm()
test('ampm() returns am or pm', t => {
    _.times(1000, () => {
        let ampm = chance.ampm()
        t.true(_.isString(ampm))
        t.true(/^([ap]m)$/m.test(ampm))
    })
})

// chance.date()
test('date() returns a random date', t => {
    _.times(1000, () => {
        let date = chance.date()
        t.true(_.isDate(date))
        t.truthy(date.getTime())
    })
})

test('date() accepts an american option', t => {
    _.times(1000, () => {
        let date = chance.date({ american: chance.bool() })
        t.true(_.isDate(date))
        t.truthy(date.getTime())
    })
})

test('date() can have some default provided and obey them', t => {
    _.times(1000, () => {
        // One of each month type in terms of number of days.
        let month = [0, 1, 3][Math.floor(Math.random() * 3)]

        let date = chance.date({ year: 1983 })
        t.true(_.isDate(date))
        t.is(date.getFullYear(), 1983)

        date = chance.date({ month: month })
        t.true(_.isDate(date))
        t.is(date.getMonth(), month)

        date = chance.date({ day: 21 })
        t.true(_.isDate(date))
        t.is(date.getDate(), 21)
    })
})

test('date() can specify min and max', t => {
    _.times(1000, () => {
        let bounds = {
            min: new Date(),
            max: new Date(new Date().getTime() + 1234567890123),
        }
        let date = chance.date(bounds)
        t.true(_.isDate(date))
        t.true(date >= bounds.min)
        t.true(date <= bounds.max)
    })
})

test('date() returns a date, can specify just min', t => {
    _.times(1000, () => {
        let bounds = { min: new Date() }
        let date = chance.date(bounds)
        t.true(_.isDate(date))
        t.true(date >= bounds.min)
    })
})

test('date() returns a date, can specify just max', t => {
    _.times(1000, () => {
        let bounds = { max: new Date() }
        let date = chance.date(bounds)
        t.true(_.isDate(date))
        t.true(date <= bounds.max)
    })
})

test('date() can return a string date', t => {
    _.times(1000, () => {
        let date = chance.date({ string: true })
        t.true(_.isString(date))
        t.true(/^[0-9][0-9]?\/[0-9][0-9]?\/[0-9]{4}/m.test(date))
    })
})

// chance.hammertime()
test('hammertime() works', t => {
    _.times(1000, () => {
        let hammertime = chance.hammertime()
        t.true(_.isNumber(hammertime))
        t.true(hammertime > 0)
        t.true(hammertime < 8640000000000000)
    })
})

// chance.hour()
test('hour() returns an hour', t => {
    _.times(1000, () => {
        let hour = chance.hour()
        t.true(_.isNumber(hour))
        t.true(hour >= 1)
        t.true(hour <= 12)
    })
})

test('hour() returns an hour in 24 hour format', t => {
    _.times(1000, () => {
        let hour = chance.hour({ twentyfour: true })
        t.true(_.isNumber(hour))
        t.true(hour >= 0)
        t.true(hour <= 23)
    })
})

test('hour() returns an hour, can specify min and max', t => {
    _.times(1000, () => {
        let hour = chance.hour({ min: 7, max: 10 })
        t.true(_.isNumber(hour))
        t.true(hour >= 7)
        t.true(hour <= 10)
    })
})

test('hour() returns an hour, can specify just min', t => {
    _.times(1000, () => {
        let hour = chance.hour({ min: 7 })
        t.true(_.isNumber(hour))
        t.true(hour >= 7)
        t.true(hour <= 12)
    })
})

test('hour() returns an hour, can specify just max', t => {
    _.times(1000, () => {
        let hour = chance.hour({ max: 10 })
        t.true(_.isNumber(hour))
        t.true(hour >= 1)
        t.true(hour <= 10)
    })
})

// chance.minute()
test('minute() returns a minute', t => {
    _.times(1000, () => {
        let minute = chance.minute()
        t.true(_.isNumber(minute))
        t.true(minute >= 0)
        t.true(minute <= 59)
    })
})

test('minute() returns an minute, can specify min and max', t => {
    _.times(1000, () => {
        let minute = chance.minute({ min: 18, max: 35 })
        t.true(_.isNumber(minute))
        t.true(minute >= 18)
        t.true(minute <= 35)
    })
})

test('minute() returns an minute, can specify just min', t => {
    _.times(1000, () => {
        let minute = chance.minute({ min: 5 })
        t.true(_.isNumber(minute))
        t.true(minute >= 5)
        t.true(minute <= 59)
    })
})

test('minute() returns an minute, can specify just max', t => {
    _.times(1000, () => {
        let minute = chance.minute({ max: 32 })
        t.true(_.isNumber(minute))
        t.true(minute >= 0)
        t.true(minute <= 32)
    })
})

test('month() returns a month', t => {
    _.times(1000, () => {
        let month = chance.month()
        t.true(_.isString(month))
    })
})

test('month() will return a raw month', t => {
    _.times(1000, () => {
        let month = chance.month({ raw: true })
        t.false(_.isString(month))
        t.true(_.isObject(month))
    })
})

test('month() returns a month, can specify min and max', t => {
    _.times(1000, () => {
        let month = chance.month({raw: true, min: 5, max: 10})
        t.false(_.isString(month))
        t.true(month.numeric >= 5)
        t.true(month.numeric <= 10)
    })
})

test('month() returns a month, can specify just min', t => {
    _.times(1000, () => {
        let month = chance.month({raw: true, min: 5})
        t.false(_.isString(month))
        t.true(month.numeric >= 5)
        t.true(month.numeric <= 12)
    })
})

test('month() returns a month, can specify just max', t => {
    _.times(1000, () => {
        let month = chance.month({raw: true, max: 7})
        t.false(_.isString(month))
        t.true(month.numeric >= 1)
        t.true(month.numeric <= 7)
    })
})

// chance.timestamp()
test('timestamp() returns a timestamp', t => {
    _.times(1000, () => {
        let timestamp = chance.timestamp()
        t.true(_.isNumber(timestamp))
        t.true(timestamp > 0)
        t.true(timestamp <= parseInt(new Date().getTime() / 1000, 10))
    })
})

// chance.timezone()
test('timezone() returns a timezone', t => {
    _.times(1000, () => {
        let timezone = chance.timezone()
        t.true(_.isString(timezone.name))
        t.true(timezone.abbr.length < 6)
        t.true(_.isNumber(timezone.offset))
    })
})

// chance.weekday()
test('weekday() will return a weekday as a string', t => {
    _.times(1000, () => {
        let weekday = chance.weekday()
        t.true(_.isString(weekday))
    })
})

test('weekday() can take work: true and obey it', t => {
    _.times(1000, () => {
        let weekday = chance.weekday({ weekday_only: true })
        t.true(_.isString(weekday))
        t.not(weekday, 'Saturday')
        t.not(weekday, 'Sunday')
    })
})

// chance.year()
test('year() returns a year, default between today and a century after', t => {
    _.times(1000, () => {
        let year = chance.year()
        t.true(_.isString(year))
        t.true(year >= new Date().getFullYear())
        t.true(year <= new Date().getFullYear() + 100)
    })
})

test('year() returns a year, can specify min and max', t => {
    _.times(1000, () => {
        let year = chance.year({ min: 2500, max: 2600 })
        t.true(_.isString(year))
        t.true(year >= 2500)
        t.true(year <= 2600)
    })
})

test('year() returns a year, can specify just min', t => {
    _.times(1000, () => {
        let year = chance.year({ min: 2500 })
        t.true(_.isString(year))
        t.true(year >= 2500)
    })
})

test('year() returns a year, can specify just max', t => {
    _.times(1000, () => {
        let year = chance.year({ max: 2500 })
        t.true(_.isString(year))
        t.true(year <= 2501)
        // Ensure year not negative. Perhaps add BCE/AD and such later,
        // but for now just positive is good enough.
        t.true(year >= 0)
    })
})
