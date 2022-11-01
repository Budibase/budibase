import test from 'ava'
import Chance from '../chance.js'
import _ from 'lodash'

const chance = new Chance()

// chance.coin()
test('coin() returns a coin', t => {
    _.times(1000, () => {
        t.true(/(heads|tails)/.test(chance.coin()))
    })
})

// chance.d4()
test('d4() returns a properly bounded d4', t => {
    _.times(1000, () => {
        let die = chance.d4()
        t.true(die >= 1)
        t.true(die <= 4)
    })
})

// chance.d6()
test('d6() returns a properly bounded d6', t => {
    _.times(1000, () => {
        let die = chance.d6()
        t.true(die >= 1)
        t.true(die <= 6)
    })
})

// chance.d8()
test('d8() returns a properly bounded d8', t => {
    _.times(1000, () => {
        let die = chance.d8()
        t.true(die >= 1)
        t.true(die <= 8)
    })
})

// chance.d10()
test('d10() returns a properly bounded d10', t => {
    _.times(1000, () => {
        let die = chance.d10()
        t.true(die >= 1)
        t.true(die <= 10)
    })
})

// chance.d12()
test('d12() returns a properly bounded d12', t => {
    _.times(1000, () => {
        let die = chance.d12()
        t.true(die >= 1)
        t.true(die <= 12)
    })
})

// chance.d20()
test('d20() returns a properly bounded d20', t => {
    _.times(1000, () => {
        let die = chance.d20()
        t.true(die >= 1)
        t.true(die <= 20)
    })
})

// chance.d30()
test('d30() returns a properly bounded d30', t => {
    _.times(1000, () => {
        let die = chance.d30()
        t.true(die >= 1)
        t.true(die <= 30)
    })
})

// chance.d100()
test('d100() returns a properly bounded d100', t => {
    _.times(1000, () => {
        let die = chance.d100()
        t.true(die >= 1)
        t.true(die <= 100)
    })
})


// chance.emotion()
test('emotion() returns a random emotion', t => {
    _.times(1000, () => {
        let emotion = chance.emotion()
        t.true(_.isString(emotion))
        t.true(emotion.length >= 2)
        t.true(emotion.length <= 30)
    })
})

// chance.guid()
test('guid() returns a proper guid', t => {
    _.times(1000, () => {
        t.true(/([0-9a-fA-F]){8}(-([0-9a-fA-F]){4}){3}-([0-9a-fA-F]){12}/.test(chance.guid()))
    })
})

test('guid() returns a proper version 1 guid', t => {
    _.times(1000, () => {
        t.true(/([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-1([0-9a-fA-F]){3}-([ab89])([0-9a-fA-F]){3}-([0-9a-fA-F]){12}/.test(chance.guid({ version: 1 })))
    })
})

test('guid() returns a proper version 2 guid', t => {
    _.times(1000, () => {
        t.true(/([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-2([0-9a-fA-F]){3}-([ab89])([0-9a-fA-F]){3}-([0-9a-fA-F]){12}/.test(chance.guid({ version: 2 })))
    })
})

test('guid() returns a proper version 3 guid', t => {
    _.times(1000, () => {
        t.true(/([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-3([0-9a-fA-F]){3}-([ab89])([0-9a-fA-F]){3}-([0-9a-fA-F]){12}/.test(chance.guid({ version: 3 })))
    })
})

test('guid() returns a proper version 4 guid', t => {
    _.times(1000, () => {
        t.true(/([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-4([0-9a-fA-F]){3}-([ab89])([0-9a-fA-F]){3}-([0-9a-fA-F]){12}/.test(chance.guid({ version: 4 })))
    })
})

test('guid() returns a proper version 5 guid', t => {
    _.times(1000, () => {
        t.true(/([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-5([0-9a-fA-F]){3}-([ab89])([0-9a-fA-F]){3}-([0-9a-fA-F]){12}/.test(chance.guid({ version: 5 })))
    })
})

// chance.hash()
test('hash() returns a proper hash', t => {
    _.times(1000, () => {
        let hash = chance.hash()
        t.true(/([0-9a-f]){40}/.test(hash))
        t.is(hash.length, 40)
    })
})

test('hash() obeys length, if supplied', t => {
    _.times(1000, () => {
        let length = chance.natural({ min: 1, max: 64 })
        let hash = chance.hash({ length: length })
        t.is(hash.length, length)
    })
})

// chance.mac_address()
test('mac_address() returns a proper mac address', t => {
    _.times(1000, () => {
        t.true(/([0-9a-fA-F]){2}:([0-9a-fA-F]){2}:([0-9a-fA-F]){2}:([0-9a-fA-F]){2}:([0-9a-fA-F]){2}:([0-9a-fA-F]){2}/.test(chance.mac_address()))
    })
})

test('mac_address() returns a proper colon separated mac address', t => {
    _.times(1000, () => {
        t.true(/([0-9a-fA-F]){2}:([0-9a-fA-F]){2}:([0-9a-fA-F]){2}:([0-9a-fA-F]){2}:([0-9a-fA-F]){2}:([0-9a-fA-F]){2}/.test(chance.mac_address({ separator: ':' })))
    })
})

test('mac_address() returns a proper hyphen separated mac address', t => {
    _.times(1000, () => {
        t.true(/([0-9a-fA-F]){2}-([0-9a-fA-F]){2}-([0-9a-fA-F]){2}-([0-9a-fA-F]){2}-([0-9a-fA-F]){2}-([0-9a-fA-F]){2}/.test(chance.mac_address({ separator: '-' })))
    })
})

test('mac_address() returns a proper network version mac address', t => {
    _.times(1000, () => {
        t.true(/([0-9a-fA-F]){4}.([0-9a-fA-F]){4}.([0-9a-fA-F]){4}/.test(chance.mac_address({ networkVersion: true })))
    })
})

// chance.mixin()
test('mixin() works with a simple function', t => {
    chance.mixin({
        user: () => {
            return {
                first: chance.first(),
                last: chance.last(),
                email: chance.email()
            }
        }
    })
    t.truthy(chance.user)
    _.times(1000, () => {
        let user = chance.user()
        t.truthy(user)
        t.truthy(user.first)
        t.true(_.isString(user.last))
        t.true(_.isString(user.email))
    })
})

test('mixin() multiple work, we can call previously defined mixins', t => {
    chance.mixin({
        user: () => {
            return {
                first: chance.first(),
                last: chance.last(),
                email: chance.email()
            }
        },
        social_user: () => {
            let user = chance.user()
            user.network = chance.pick(['facebook', 'twitter'])
            return user
        }
    })
    t.truthy(chance.user)
    t.truthy(chance.social_user)
    _.times(1000, () => {
        let social_user = chance.social_user()
        t.truthy(social_user)
        t.truthy(social_user.first)
        t.truthy(social_user.network)
        t.true(social_user.network === 'facebook' ||
               social_user.network === 'twitter')
    })
})

// chance.radio()
test('radio() works as expected', t => {
    _.times(1000, () => {
        let radio = chance.radio()
        t.true(_.isString(radio))
        t.is(radio.length, 4)
        t.true(/^[KW][A-Z][A-Z][A-Z]/.test(radio))
    })
})

test('radio() accepts east', t => {
    _.times(1000, () => {
        let radio = chance.radio({ side: 'east' })
        t.true(_.isString(radio))
        t.is(radio.length, 4)
        t.true(/^[W][A-Z][A-Z][A-Z]/.test(radio))
    })
})

test('radio() accepts west', t => {
    _.times(1000, () => {
        let radio = chance.radio({ side: 'west' })
        t.true(_.isString(radio))
        t.is(radio.length, 4)
        t.true(/^[K][A-Z][A-Z][A-Z]/.test(radio))
    })
})

// chance.rpg()
test('rpg() appears to work as expected', t => {
    _.times(1000, () => {
        let dice = chance.rpg('5d20')
        t.true(_.isArray(dice))
        t.is(dice.length, 5)
        dice.map((die) => {
            t.true(die >= 1)
            t.true(die <= 20)
        })
    })
})

test('rpg() without a die roll throws an error', t => {
    t.throws(() => chance.rpg(), 'Chance: A type of die roll must be included')
})

test('rpg() throws errors where it should', t => {
    const errorFns = [
        () => chance.rpg('3'),
        () => chance.rpg('hd23'),
        () => chance.rpg('3d23d2'),
        () => chance.rpg('d20')
    ]
    errorFns.map((fn) => {
        t.throws(fn, 'Chance: Invalid format provided. Please provide #d# where the first # is the number of dice to roll, the second # is the max of each die')
    })
})

test('rpg() will take and obey a sum', t => {
    _.times(1000, () => {
        let rpg = chance.rpg('4d20', { sum: true })
        t.true(_.isNumber(rpg))
        t.true(rpg >= 4)
        t.true(rpg <= 80)
    })
})

// chance.tv()
test('tv() works as expected', t => {
    _.times(1000, () => {
        let tv = chance.tv()
        t.true(_.isString(tv))
        t.is(tv.length, 4)
        t.true(/^[KW][A-Z][A-Z][A-Z]/.test(tv))
    })
})
