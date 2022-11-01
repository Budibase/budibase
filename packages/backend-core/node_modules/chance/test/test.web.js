import test from 'ava'
import Chance from '../chance.js'
import _ from 'lodash'

const chance = new Chance()

// chance.avatar()
test('avatar() returns a legit avatar', t => {
    _.times(1000, () => {
        let avatar = chance.avatar()
        t.true(_.isString(avatar))
        t.is(avatar.split('/').length, 5)
    })
})

test('avatar() can take and ignore an invalid protocol', t => {
    _.times(1000, () => {
        let avatar = chance.avatar({ protocol: 'invalid' })
        t.true(_.isString(avatar))
        t.is(avatar.indexOf('//'), 0)
    })
})

test('avatar() can take and respect a protocol', t => {
    const protocols = ['http', 'https']
    _.times(500, () => {
        protocols.map((protocol) => {
            let avatar = chance.avatar({ protocol: protocol })
            t.true(_.isString(avatar))
            t.is(avatar.indexOf(protocol + ":"), 0)
        })
    })
})

test('avatar() can take and respect email', t => {
    _.times(1000, () => {
        let avatar = chance.avatar({ email: chance.email() })
        t.true(_.isString(avatar))
        t.is(avatar.split('/').length, 5)
    })
})

test('avatar() can take and ignore an invalid file extension', t => {
    _.times(1000, () => {
        let avatar = chance.avatar({ fileExtension: 'invalid' })
        t.true(_.isString(avatar))
        t.false(avatar.includes('.jpg'))
        t.false(avatar.includes('.png'))
        t.false(avatar.includes('.gif'))
    })
})

test('avatar() can take and respect a legit file extension', t => {
    let file_types = ['bmp', 'gif', 'jpg', 'png']
    _.times(250, () => {
        _.times(file_types.length, (index) => {
            let avatar = chance.avatar({ fileExtension: file_types[index] })
            t.true(_.isString(avatar))
            t.true(avatar.includes('.' + file_types[index]))
        })
    })
})

test('avatar() can take and ignore an invalid size', t => {
    _.times(1000, () => {
        let avatar = chance.avatar({ size: 'abc' })
        t.true(_.isString(avatar))
        t.false(avatar.includes('&s='))
    })
})

test('avatar() can take and respect a legit size', t => {
    _.times(1000, (index) => {
        let avatar = chance.avatar({ size: index + 1 })
        t.true(_.isString(avatar))
        t.true(avatar.includes('&s=' + (index + 1).toString()))
    })
})

test('avatar() can take and ignore an invalid rating', t => {
    _.times(1000, () => {
        let avatar = chance.avatar({ rating: 'invalid' })
        t.true(_.isString(avatar))
        t.false(avatar.includes('&r='))
    })
})

test('avatar() can take and respect a rating', t => {
    let ratings = ['g', 'pg', 'r', 'x']
    _.times(250, () => {
        _.times(ratings.length, (index) => {
            let avatar = chance.avatar({ rating: ratings[index] })
            t.true(_.isString(avatar))
            t.true(avatar.includes('&r=' + ratings[index]))
        })
    })
})

test('avatar() can take and ignore an invalid fallback image', t => {
    _.times(1000, () => {
        let avatar = chance.avatar({ fallback: 'invalid' })
        t.true(_.isString(avatar))
        t.false(avatar.includes('&d='))
    })
})

test('avatar() can take just an email', t => {
    _.times(1000, () => {
        let avatar = chance.avatar('mail@victorquinn.com')
        t.true(_.isString(avatar))
        t.false(avatar.includes('&d='))
    })
})

test('avatar() can take and respect a fallback image', t => {
    let fallbacks = [
        '404', // Return 404 if not found
        'mm', // Mystery man
        'identicon', // Geometric pattern based on hash
        'monsterid', // A generated monster icon
        'wavatar', // A generated face
        'retro', // 8-bit icon
        'blank' // A transparent png
    ]
    _.times(100, () => {
        _.times(fallbacks.length, (index) => {
            let avatar = chance.avatar({ fallback: fallbacks[index] })
            t.true(_.isString(avatar))
            t.true(avatar.includes('&d=' + fallbacks[index]))
        })
    })
})

// chance.color()
test('color() returns what looks like a hex color', t => {
    _.times(1000, () => {
        let color = chance.color({ format: 'hex' })
        t.true(_.isString(color))
        t.is(color.length, 7)
        t.true(/#[a-z0-9]+/m.test(color))
    })
})

test('color() returns what looks like a gray scale hex color', t => {
    _.times(1000, () => {
        let color = chance.color({ format: 'hex', grayscale: true })
        t.true(_.isString(color))
        t.is(color.length, 7)
        t.true(/#[a-z0-9]+/m.test(color))
        t.is(color.slice(1, 3), color.slice(3, 5))
        t.is(color.slice(1, 3), color.slice(5, 7))
    })
})

test('color() returns a short hex color', t => {
    _.times(1000, () => {
        let color = chance.color({ format: 'shorthex' })
        t.true(_.isString(color))
        t.is(color.length, 4)
        t.true(/#[a-z0-9]+/m.test(color))
    })
})

test('color() returns what looks like a grayscale short hex color', t => {
    _.times(1000, () => {
        let color = chance.color({ format: 'shorthex', grayscale: true })
        t.true(_.isString(color))
        t.is(color.length, 4)
        t.is(color.slice(1, 2), color.slice(2, 3))
        t.is(color.slice(1, 2), color.slice(3, 4))
    })
})

test('color() returns what looks like an rgb color', t => {
    _.times(1000, () => {
        let color = chance.color({ format: 'rgb' })
        t.true(_.isString(color))
        let match = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/.exec(color)
        t.is(match.length, 4)
        t.true(match[1] >= 0)
        t.true(match[1] <= 255)
        t.true(match[2] >= 0)
        t.true(match[2] <= 255)
        t.true(match[3] >= 0)
        t.true(match[3] <= 255)
    })
})

test('color() returns what looks like a grayscale rgb color', t => {
    _.times(1000, () => {
        let color = chance.color({ format: 'rgb', grayscale: true })
        t.true(_.isString(color))
        let match = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/.exec(color)
        t.is(match.length, 4)
        t.true(match[1] >= 0)
        t.true(match[1] <= 255)
        t.is(match[1], match[2])
        t.is(match[1], match[3])
    })
})

test('color() returns what looks like an rgba color', t => {
    _.times(1000, () => {
        let color = chance.color({ format: 'rgba' })
        t.true(_.isString(color))
        let match = /rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),([01]\.?\d*?)\)/.exec(color)
        t.is(match.length, 5)
        t.true(match[1] >= 0)
        t.true(match[1] <= 255)
        t.true(match[2] >= 0)
        t.true(match[2] <= 255)
        t.true(match[3] >= 0)
        t.true(match[3] <= 255)
        t.true(match[4] >= 0)
        t.true(match[4] <= 255)
    })
})

test('color() returns what looks like a grayscale rgba color', t => {
    _.times(1000, () => {
        let color = chance.color({ format: 'rgba', grayscale: true })
        t.true(_.isString(color))
        let match = /rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),([01]\.?\d*?)\)/.exec(color)
        t.is(match.length, 5)
        t.true(match[1] >= 0)
        t.true(match[1] <= 255)
        t.true(match[2] >= 0)
        t.true(match[2] <= 255)
        t.true(match[3] >= 0)
        t.true(match[3] <= 255)
        t.true(match[4] >= 0)
        t.true(match[4] <= 255)
        t.is(match[1], match[2])
        t.is(match[1], match[3])
        t.true(match[4] >= 0)
        t.true(match[4] <= 1)
    })
})

test('color() 0x color works', t => {
    _.times(1000, () => {
        let color = chance.color({ format: '0x' })
        t.true(_.isString(color))
        t.is(color.length, 8)
        t.true(/0x[a-z0-9]+/m.test(color))
    })
})

test('color() with name returns a valid color name', t => {
    _.times(1000, () => {
        let color = chance.color({ format: 'name' })
        t.true(_.isString(color))
    })
})

test('color() upper case returns upper cased color', t => {
    _.times(1000, () => {
        let color = chance.color({ format: 'hex', casing: 'upper' })
        t.true(_.isString(color))
        t.is(color.length, 7)
        t.is(color.charAt(1).toUpperCase(), color.charAt(1))
        t.is(color.charAt(2).toUpperCase(), color.charAt(2))
        t.is(color.charAt(3).toUpperCase(), color.charAt(3))
        t.is(color.charAt(4).toUpperCase(), color.charAt(4))
        t.is(color.charAt(5).toUpperCase(), color.charAt(5))
        t.is(color.charAt(6).toUpperCase(), color.charAt(6))
    })
})

test('color() bogus format throws error', t => {
    const fn = () => chance.color({ format: 'banana' })
    t.throws(fn)
})

// chance.domain()
test('domain() returns a domain', t => {
    _.times(1000, () => {
        let domain = chance.domain()
        t.true(_.isString(domain))
        t.true(domain.split('.').length > 1)
    })
})

test('domain() obeys tld, if specified', t => {
    _.times(1000, () => {
        let domain = chance.domain({ tld: 'com' })
        t.true(_.isString(domain))
        t.is(domain.split('.')[1], 'com')
    })
})

// chance.email()
test('email() returns what looks like an email', t => {
    _.times(1000, () => {
        let email = chance.email()
        t.true(_.isString(email))
        t.true(email.split('@').length > 1)
    })
})

test('email() obeys domain, if specified', t => {
    _.times(1000, () => {
        let email = chance.email({ domain: 'victorquinn.com' })
        t.true(_.isString(email))
        t.is(email.split('@')[1], 'victorquinn.com')
    })
})

test('email() has a leng specified, should generate string before domain with equal length', t => {
    _.times(1000, () => {
        let email = chance.email({ length: 5 })
        t.is(email.split('@')[0].length, 5)
    })
})

// chance.fbid()
test('fbid() returns what looks like a Facebook id', t => {
    _.times(1000, () => {
        let fbid = chance.fbid()
        t.true(_.isString(fbid))
        t.is(fbid.length, 16)
    })
})

// chance.google_analytics()
test('google_analytics() returns what looks like a valid tracking code', t => {
    _.times(1000, () => {
        let tracking_code = chance.google_analytics()
        t.true(_.isString(tracking_code))
        t.is(tracking_code.length, 12)
        t.true(tracking_code.includes('UA-'))
    })
})

// chance.hashtag()
test('hashtag() returns what looks like a hashtag', t => {
    _.times(1000, () => {
        let hashtag = chance.hashtag()
        t.true(_.isString(hashtag))
        t.true(/^\#\w+$/m.test(hashtag))
    })
})

// chance.ip()
test('ip() returns what looks like an IP address', t => {
    _.times(1000, () => {
        let ip = chance.ip()
        t.true(_.isString(ip))
        t.is(ip.split('.').length, 4)
        t.true(/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/.test(ip))
    })
})

// chance.ipv6()
test('ipv6() returns what looks like an IP address (v6)', t => {
    _.times(1000, () => {
        let ipv6 = chance.ipv6()
        t.true(_.isString(ipv6))
        t.is(ipv6.split(':').length, 8)
        t.true(/[a-f0-9]+:[a-f0-9]+:[a-f0-9]+:[a-f0-9]+:[a-f0-9]+:[a-f0-9]+:[a-f0-9]+:[a-f0-9]+/.test(ipv6))
    })
})

// chance.klout()
test('klout() returns what looks like a legit Klout score', t => {
    _.times(1000, () => {
        let klout = chance.klout()
        t.true(_.isNumber(klout))
        t.true(klout > 0)
        t.true(klout <= 100)
    })
})

// chance.locale()
test('locale() should create a valid two character locale with only language', t => {
    let locale = chance.locale()
    t.true(_.isString(locale))
    t.is(locale.length, 2)
})

test('locale() should create a locale with a region code', t => {
    let locale = chance.locale({ region: true })
    t.true(_.isString(locale))
    t.true(locale.split('-').length >= 2)
})

// chance.locales()
test('locales() should return a list of locales', t => {
    let locales = chance.locales()
    t.true(_.isArray(locales))
    t.true(locales.length > 100)
})

test('locales() should return a list of locales', t => {
    let locales = chance.locales({ region: true })
    t.true(_.isArray(locales))
    t.true(locales.length > 100)
})

// chance.md5()
test('md5() should create a hex-encoded MD5 hash of a random ASCII value when passed nothing', t => {
    t.is(chance.md5().length, '2063c1608d6e0baf80249c42e2be5804'.length)
})

test('md5() should create a hex-encoded MD5 hash of an ASCII value when passed a string', t => {
    t.is(chance.md5('value'), '2063c1608d6e0baf80249c42e2be5804')
})

test('md5() should create a hex-encoded MD5 hash of an ASCII value when passed an object', t => {
    t.is(chance.md5({ str: 'value' }), '2063c1608d6e0baf80249c42e2be5804')
})

test('md5() should create a hex-encoded MD5 hash of a UTF-8 value', t => {
    t.is(chance.md5('日本'), '4dbed2e657457884e67137d3514119b3')
})

test('md5() should create a hex-encoded HMAC-MD5 hash of an ASCII value and key', t => {
    t.is(chance.md5({ str: 'value', key: 'key' }), '01433efd5f16327ea4b31144572c67f6')
})

test('md5() should create a hex-encoded HMAC-MD5 hash of a UTF-8 value and key', t => {
    t.is(chance.md5({ str: '日本', key: '日本' }), 'c78b8c7357926981cc04740bd3e9d015')
})

test('md5() should create a raw MD5 hash of an ASCII value', t => {
    t.is(chance.md5({ str: 'value', key: null, raw: true }), ' c\xc1`\x8dn\x0b\xaf\x80$\x9cB\xe2\xbeX\x04')
})

test('md5() should create a raw MD5 hash of a UTF-8 value', t => {
    t.is(chance.md5({ str: '日本', key: null, raw: true }), 'M\xbe\xd2\xe6WEx\x84\xe6q7\xd3QA\x19\xb3')
})

test('md5() should create a raw HMAC-MD5 hash of an ASCII value', t => {
    t.is(chance.md5({ str: 'value', key: 'key', raw: true }), '\x01C>\xfd_\x162~\xa4\xb3\x11DW,g\xf6')
})

test('md5() should create a raw HMAC-MD5 hash of a UTF-8 value', t => {
    t.is(chance.md5({ str: '日本', key: '日本', raw: true }), '\xc7\x8b\x8csW\x92i\x81\xcc\x04t\x0b\xd3\xe9\xd0\x15')
})

// chance.port()
test('port() should create a number in the valid port range (0 - 65535)', t => {
    _.times(1000, () => {
        let port = chance.port()
        t.true(_.isNumber(port))
        t.true(port >= 0)
        t.true(port <= 65535)
    })
})

// chance.semver()
test('semver() works as expected', t => {
    _.times(1000, () => {
        let semver = chance.semver()
        t.true(_.isString(semver))
        t.true(/[0-9]+\.[0-9]+\.[0-9]+/.test(semver))
    })
})

test('semver() accepts a range', t => {
    _.times(1000, () => {
        let semver = chance.semver({ range: 'banana' })
        t.true(_.isString(semver))
        t.true(/^banana[0-9]+\.[0-9]+\.[0-9]+/.test(semver))
    })
})

test('semver() accepts a prerelease flag', t => {
    _.times(1000, () => {
        let semver = chance.semver({ range: 'banana' })
        t.true(_.isString(semver))
        t.true(/[0-9]+\.[0-9]+\.[0-9]+-?[dev|beta|alpha]?/.test(semver))
    })
})

// chance.tld()
test('tld() returns a tld', t => {
    _.times(1000, () => {
        let tld = chance.tld()
        t.true(_.isString(tld))
        t.true(tld.length < 6)
    })
})

// chance.twitter()
test('twitter() returns what looks like a Twitter handle', t => {
    _.times(1000, () => {
        let twitter = chance.twitter()
        t.true(_.isString(twitter))
        t.true(/\@[A-Za-z]+/m.test(twitter))
    })
})

// chance.url()
test('url() deal with url', t => {
    _.times(1000, () => {
        let url = chance.url()
        t.true(_.isString(url))
        t.true(url.split('.').length > 1)
        t.true(url.split('://').length > 1)
    })
})

test('url() can take and respect a domain', t => {
    _.times(1000, () => {
        let url = chance.url({ domain: 'victorquinn.com' })
        t.true(_.isString(url))
        t.true(url.split('.').length > 1)
        t.true(url.split('://').length > 1)
        t.true(url.split('victorquinn.com').length > 1)
    })
})

test('url() can take and respect a domain prefix', t => {
    _.times(1000, () => {
        let url = chance.url({ domain_prefix: 'www' })
        t.true(_.isString(url))
        t.true(url.split('.').length > 1)
        t.true(url.split('://').length > 1)
        t.true(url.split('www').length > 1)
    })
})

test('url() can take and respect a path', t => {
    _.times(1000, () => {
        let url = chance.url({ path: 'images' })
        t.true(_.isString(url))
        t.true(url.split('.').length > 1)
        t.true(url.split('://').length > 1)
        t.true(url.split('/images').length > 1)
    })
})

test('url() can take and respect extensions', t => {
    _.times(1000, () => {
        let url = chance.url({ extensions: ['html'] })
        t.true(_.isString(url))
        t.true(url.split('.').length > 1)
        t.true(url.split('://').length > 1)
        t.not(url.indexOf('.html'), -1)
    })
})

// chance.loremPicsum()
test('loremPicsum() returns loremPicsum url with default width and height', t => {
    _.times(1000, () => {
        let loremPicsumUrl = chance.loremPicsum()
        t.true(_.isString(loremPicsumUrl))
        t.true(loremPicsumUrl.split('.').length > 1)
        t.true(loremPicsumUrl.split('://').length > 1)
        t.true(loremPicsumUrl.split('picsum.photos').length > 1)
        t.true(loremPicsumUrl.split('/500/500').length > 1)
        t.true(loremPicsumUrl.split('/?random').length > 1)
    })
})
test('loremPicsum() returns loremPicsum url that respects width and height', t => {
    _.times(1000, () => {
        let width = chance.natural();
        let height = chance.natural();
        let loremPicsumUrl = chance.loremPicsum({
            width,
            height
        })
        t.true(_.isString(loremPicsumUrl))
        t.true(loremPicsumUrl.split('.').length > 1)
        t.true(loremPicsumUrl.split('://').length > 1)
        t.true(loremPicsumUrl.split('picsum.photos').length > 1)
        t.true(loremPicsumUrl.split('/' + width + '/' + height).length > 1)
        t.true(loremPicsumUrl.split('/?random').length > 1)
    })
})
test('loremPicsum() returns loremPicsum url that respects greyscale', t => {
    _.times(1000, () => {
        let loremPicsumUrl = chance.loremPicsum({
            greyscale: true
        })
        t.true(_.isString(loremPicsumUrl))
        t.true(loremPicsumUrl.split('.').length > 1)
        t.true(loremPicsumUrl.split('://').length > 1)
        t.true(loremPicsumUrl.split('picsum.photos').length > 1)
        t.true(loremPicsumUrl.split('/g/500/500').length > 1)
        t.true(loremPicsumUrl.split('/?random').length > 1)
    })
})
test('loremPicsum() returns loremPicsum url that respects blurred', t => {
    _.times(1000, () => {
        let loremPicsumUrl = chance.loremPicsum({
            blurred: true
        })
        t.true(_.isString(loremPicsumUrl))
        t.true(loremPicsumUrl.split('.').length > 1)
        t.true(loremPicsumUrl.split('://').length > 1)
        t.true(loremPicsumUrl.split('picsum.photos').length > 1)
        t.true(loremPicsumUrl.split('/500/500').length > 1)
        t.true(loremPicsumUrl.split('/?blur').length > 1)
    })
})
