import test from 'ava'
import Chance from '../chance.js'
import _ from 'lodash'
import phoneNumber from './helpers/phoneNumber.min.js'

const chance = new Chance()

// chance.address()
test('address() returns a string', t => {
    t.true(_.isString(chance.address()))
})

test('address() starts with a number', t => {
    _.times(1000, () => t.true(/[0-9]+.+/.test(chance.address())))
})

test('address() can take a short_suffix arg and obey it', t => {
    _.times(1000, () => {
        let address = chance.address({ short_suffix: true })
        t.true(address.split(' ')[2].length < 5)
    })
})

// chance.altitude()
test('altitude() looks right', t => {
    t.is(typeof chance.altitude(), 'number')
})

test('altitude() is in the right range', t => {
    _.times(1000, () => {
        let altitude = chance.altitude()
        t.true(altitude > 0)
        t.true(altitude < 8848)
    })
})

test('altitude() will accept a min and obey it', t => {
    _.times(1000, () => {
        let min = chance.floating({ min: 0, max: 8848 })
        let altitude = chance.altitude({ min: min })
        t.true(altitude > min)
        t.true(altitude < 8848)
    })
})

test('altitude() will accept a max and obey it', t => {
    _.times(1000, () => {
        let max = chance.floating({ min: 0, max: 8848 })
        let altitude = chance.altitude({ max: max })
        t.true(altitude > 0)
        t.true(altitude < max)
    })
})

// chance.areacode()
test('areacode() looks right', t => {
    _.times(1000, () => {
        let areacode = chance.areacode()
        t.true(_.isString(areacode))
        t.true(/^\(([2-9][0-8][0-9])\)$/.test(areacode))
    })
})

test('areacode() can take parens', t => {
    _.times(1000, () => {
        let areacode = chance.areacode({ parens: false })
        t.true(_.isString(areacode))
        t.true(/^([2-9][0-8][0-9])$/.test(areacode))
    })
})

// chance.city()
test('city() looks right', t => {
    _.times(1000, () => {
        let city = chance.city()
        t.true(_.isString(city))
        t.true(/[a-zA-Z]+/.test(city))
    })
})

// chance.coordinates()
test('coordinates() looks right', t => {
    _.times(1000, () => {
        let coordinates = chance.coordinates()
        t.true(_.isString(coordinates))
        t.is(coordinates.split(',').length, 2)
    })
})

// chance.counties()
test('counties() returns an array of counties', t => {
    t.true(_.isArray(chance.counties()))
})

test('counties() returns a (long) county name', t => {
    _.times(1000, () => t.true(chance.counties({ full: true }).length > 2))
})

test('counties() can return a random (long) county name', t => {
    _.times(1000, () => {
        t.true(chance.counties({ full: true, country: 'uk' }).length > 2)
    })
})

// chance.countries()
test('countries() returns an array of countries', t => {
    t.true(_.isArray(chance.countries()))
})

// chance.country()
test('country() returns a random (short) country name', t => {
    _.times(1000, () => {
        t.is(chance.country().length, 2)
    })
})

test('country() returns a random (long) country name', t => {
    _.times(1000, () => {
        t.true(chance.country({ full: true }).length > 2)
    })
})

// chance.county()
test('county() returns a random county name', t => {
    _.times(1000, () => {
        t.true(_.isString(chance.county()))
    })
})

test('country() returns a random (long) country name', t => {
    _.times(1000, () => {
        t.true(chance.country({ full: true }).length > 2)
    })
})

// chance.depth()
test('depth() looks right', t => {
    t.is(typeof chance.depth(), 'number')
})

test('depth() is in the right range', t => {
    _.times(1000, () => {
        let depth = chance.depth()
        t.true(depth > -10994)
        t.true(depth < 0)
    })
})

test('depth() will accept a min and obey it', t => {
    _.times(1000, () => {
        let min = chance.floating({ min: -10994, max: 0 })
        let depth = chance.depth({ min: min })
        t.true(depth > min)
        t.true(depth < 0)
    })
})

test('depth() will accept a max and obey it', t => {
    _.times(1000, () => {
        let max = chance.floating({ min: -10994, max: 0 })
        let depth = chance.depth({ max: max })
        t.true(depth > -10994)
        t.true(depth < max)
    })
})

// chance.geohash
test('geohash() looks right', t => {
    let geohash = chance.geohash()
    t.true(_.isString(geohash))
    t.is(geohash.length, 7)
})

test('geohash() will accept a length and obey it', t => {
    _.times(1000, () => {
        let length = chance.d10()
        let geohash = chance.geohash({ length: length })
        t.is(geohash.length, length)
    })
})

// chance.latitude()
test('latitude() looks right', t => {
    t.is(typeof chance.latitude(), 'number')
})

test('latitude() is in the right range', t => {
    _.times(1000, () => {
        let latitude = chance.latitude()
        t.true(latitude >= -90)
        t.true(latitude <= 90)
    })
})

test('latitude() will accept a min and obey it', t => {
    _.times(1000, () => {
        let min = chance.floating({ min: -90, max: 90 })
        let latitude = chance.latitude({ min: min })
        t.true(latitude >= min)
        t.true(latitude <= 90)
    })
})

test('latitude() will accept a max and obey it', t => {
    _.times(1000, () => {
        let max = chance.floating({ min: -90, max: 90 })
        let latitude = chance.latitude({ max: max })
        t.true(latitude >= -90)
        t.true(latitude <= max)
    })
})

// chance.longitude()
test('longitude() looks right', t => {
    t.is(typeof chance.longitude(), 'number')
})

test('longitude() is in the right range', t => {
    _.times(1000, () => {
        let longitude = chance.longitude()
        t.true(longitude >= -180)
        t.true(longitude <= 180)
    })
})

test('longitude() will accept a min and obey it', t => {
    _.times(1000, () => {
        let min = chance.floating({ min: -180, max: 180 })
        let longitude = chance.longitude({ min: min })
        t.true(longitude >= min)
        t.true(longitude <= 180)
    })
})

test('longitude() will accept a max and obey it', t => {
    _.times(1000, () => {
        let max = chance.floating({ min: -180, max: 180 })
        let longitude = chance.longitude({ max: max })
        t.true(longitude >= -180)
        t.true(longitude <= max)
    })
})

// chance.phone()
test('phone() returns a string', t => {
    t.true(_.isString(chance.phone()))
})

test('phone() looks like an actual phone number', t => {
    t.true(/^\(([2-9][0-8][0-9])\)?[\-. ]?([2-9][0-9]{2,2})[\-. ]?([0-9]{4,4})$/.test(chance.phone()))
})

test('phone() obeys formatted option', t => {
    _.times(1000, () => {
        let phone = chance.phone({ formatted: false })
        t.true(_.isString(phone))
        t.true(/^[2-9][0-8]\d[2-9]\d{6,6}$/.test(phone))
    })
})

test('phone() obeys formatted option and parens option', t => {
    _.times(1000, () => {
        let phone = chance.phone({ formatted: false, parens: true })
        t.true(_.isString(phone))
        t.true(/^[2-9][0-8]\d[2-9]\d{6,6}$/.test(phone))
    })
})

test('phone() with uk option works', t => {
    t.true(_.isString(chance.phone({ country: 'uk' })))
})

test('phone() with uk option works and mobile option', t => {
    t.true(_.isString(chance.phone({ country: 'uk', mobile: true })))
})

test('phone() with uk country looks right', t => {
    t.true(phoneNumber.isValid(chance.phone({ country: 'uk' })))
})

test('phone() with uk country unformatted looks right', t => {
    t.true(phoneNumber.isValid(phoneNumber.format(chance.phone({
        country: 'uk',
        formatted: false
    }))))
})

test('phone() with uk country and mobile option looks right', t => {
    _.times(1000, () => {
        t.true(phoneNumber.isValid(chance.phone({
            country: 'uk',
            mobile: true
        })))
    })
})

test('phone() with uk country and mobile option unformatted looks right', t => {
    _.times(1000, () => {
        t.true(phoneNumber.isValid(phoneNumber.format(chance.phone({
            country: 'uk',
            mobile: true,
            formatted: false
        }))))
    })
})

test('phone() with fr country works', t => {
    t.true(_.isString(chance.phone({ country: 'fr' })))
})

test('phone() with fr country works with mobile option', t => {
    t.true(_.isString(chance.phone({ country: 'fr', mobile: true })))
})

test('phone() with fr country looks right', t => {
    _.times(1000, () => {
        t.true(/0[123459] .. .. .. ../.test(chance.phone({ country: 'fr' })))
    })
})

test('phone() with fr country looks right unformatted', t => {
    _.times(1000, () => {
        t.true(/0........./.test(chance.phone({
            country: 'fr',
            formatted: false
        })))
    })
})

test('phone() with fr country on mobile looks right', t => {
    _.times(1000, () => {
        t.true(/0[67] .. .. .. ../.test(chance.phone({
            country: 'fr',
            mobile: true
        })))
    })
})

test('phone() with fr country on mobile, unformatted looks right', t => {
    _.times(1000, () => {
        t.true(/0[67]......../.test(chance.phone({
            country: 'fr',
            mobile: true,
            formatted: false
        })))
    })
})

test('phone() with br country option works', t => {
    t.true(_.isString(chance.phone({ country: 'br' })))
})

test('phone() with br country and mobile option works', t => {
    t.true(_.isString(chance.phone({ country: 'br', mobile: true })))
})

test('phone() with br country and formatted false option return a correct format', t => {
    t.true(/([0-9]{2})([2-5]{1})([0-9]{3})([0-9]{4})/.test(chance.phone({
        country: 'br',
        mobile: false,
        formatted: false
    })))
})

test('phone() with br country, formatted false and mobile option return a correct format', t => {
    t.true(/([0-9]{2})\9([0-9]{4})([0-9]{4})/.test(chance.phone({
        country: 'br',
        mobile: true,
        formatted: false
    })))
})

test('phone() with br country and formatted option apply the correct mask', t => {
    t.true(/\(([0-9]{2})\) ([2-5]{1})([0-9]{3})\-([0-9]{4})/.test(chance.phone({
        country: 'br',
        mobile: false,
        formatted: true
    })))
})

test('phone() with br country, formatted and mobile option apply the correct mask', t => {
    t.true(/\(([0-9]{2})\) 9([0-9]{4})\-([0-9]{4})/.test(chance.phone({
        country: 'br',
        mobile: true,
        formatted: true
    })))
})

// chance.postal()
test('postal() returns a valid basic postal code', t => {
    _.times(1000, () => {
        let postal = chance.postal()
        t.is(postal.length, 7)
        postal.split('').map((char) => {
            t.is(char.toUpperCase(), char)
        })
    })
})

test('postcode() returns a valid basic postcode', t => {
    _.times(10, () => {
        let postcode = chance.postcode();
        t.regex(postcode, /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/);
    })
})

// chance.province()
test('province() returns a random (short) province name', t => {
    _.times(1000, () => t.true(chance.province().length < 3))
})

test('province() can return a long random province name', t => {
    _.times(1000, () => t.true(chance.province({ full: true }).length > 2))
})

test('province() can return a random long "it" province', t => {
    _.times(1000, () => {
        t.true(chance.province({country: 'it', full: true }).length > 2)
    })
})

// chance.provinces()
test('provinces() returns an array of provinces', t => {
    t.true(_.isArray(chance.provinces()))
})

test('provinces() supports internationalization', t => {
    t.not(chance.provinces(), chance.provinces({ country: 'it' }))
})

// chance.state()
test('state() returns a random (short) state name', t => {
    _.times(1000, () => t.true(chance.state().length < 3))
})

test('state() can take a country and return a state', t => {
    _.times(1000, () => t.true(chance.state({ country: 'it' }).length === 3))
})

test('state() can return full state name', t => {
    _.times(1000, () => {
        t.true(chance.state({
            full: true
        }).length > 2)
    })
})

test('state() with country returns a long state name', t => {
    _.times(1000, () => {
        t.true(chance.state({
            country: 'it',
            full: true
        }).length > 2)
    })
    _.times(1000, () => {
        t.true(chance.state({
            country: 'uk',
            full: true
        }).length > 2)
    })
})

// chance.states()
test('states() returns an array of states', t => {
    t.true(_.isArray(chance.states()))
})

test('states() returns all 50 states and DC', t => {
    t.is(chance.states().length, 51)
})

test('states() with territories returns 50 US states, DC, and 7 US territories', t => {
    t.is(chance.states({
        territories: true
    }).length, 58)
})

test('states() without us states and dc returns 7 US territories', t => {
    t.is(chance.states({
        territories: true,
        us_states_and_dc: false
    }).length, 7)
})

test('states() with armed forces returns 50 states, DC, and 3 armed forces military states', t => {
    t.is(chance.states({
        armed_forces: true
    }).length, 54)
})

test('states() with armed forces without states returns 3 armed forces states', t => {
    t.is(chance.states({
        armed_forces: true,
        us_states_and_dc: false
    }).length, 3)
})

test('states() with all options returns 61 items', t => {
    t.is(chance.states({
        territories: true,
        armed_forces: true
    }).length, 61)
})

test('states() without states returns 7 territories and 3 armed forces states', t => {
    t.is(chance.states({
        territories: true,
        armed_forces: true,
        us_states_and_dc: false
    }).length, 10)
})

test('states() with country of "it" returns 20 regions', t => {
    t.is(chance.states({
        country: 'it'
    }).length, 20)
})

test('states() with country of "uk" returns 129 UK counties', t => {
    t.is(chance.states({
        country: 'uk'
    }).length, 129)
})

test('states() with country of "mx" returns 32 MX states', t => {
    t.is(chance.states({
        country: 'mx'
    }).length, 32)
})

// chance.street()
test('street() works', t => {
    _.times(100, () => t.is(typeof chance.street(), 'string'))
})

test('street() works with it country', t => {
    _.times(100, () => t.is(typeof chance.street({ country: 'it' }), 'string'))
})

// chance.street_suffix()
test('street_suffix() returns a single suffix', t => {
    _.times(1000, () => {
        let suffix = chance.street_suffix()
        t.is(typeof suffix, 'object')
        t.is(typeof suffix.name, 'string')
        t.is(typeof suffix.abbreviation, 'string')
    })
})

// chance.street_suffixes()
test('street_suffixes() returns the suffix array', t => {
    let suffixes = chance.street_suffixes()
    t.true(_.isArray(suffixes))
    suffixes.map((suffix) => {
        t.truthy(suffix.name)
        t.truthy(suffix.abbreviation)
    })
})

test('street_suffixes() are short', t => {
    let suffixes = chance.street_suffixes()
    suffixes.map((suffix) => {
        t.true(suffix.abbreviation.length < 5)
    })
})

test('street_suffixes() are longish', t => {
    let suffixes = chance.street_suffixes()
    suffixes.map((suffix) => {
        t.true(suffix.name.length > 2)
    })
})

// chance.zip()
test('zip() returns a valid basic zip code', t => {
    _.times(1000, () => {
        let zip = chance.zip()
        t.is(zip.length, 5)
        t.true(/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zip))
    })
})

test('zip() returns a valid zip+4 code', t => {
    _.times(1000, () => {
        let zip = chance.zip({ plusfour: true })
        t.is(zip.length, 10)
        t.true(/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zip))
    })
})
