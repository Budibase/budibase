import test from 'ava'
import Chance from '../chance.js'
import _ from 'lodash'

const chance = new Chance()

// chance.android_id()
test('android_id() returns a proper android id', t => {
    _.times(1000, () => t.true(/APA91([0-9a-zA-Z-_]){178}/.test(chance.android_id())))
})

// chance.apple_token()
test('apple_token() returns a proper apple push token', t => {
    _.times(1000, () => t.true(/([0-9a-fA-F]){64}/.test(chance.apple_token())))
})

// chance.wp8_anid2()
test('wp8_anid2() returns a proper windows phone 8 anid2', t => {
    _.times(1000, () => t.true(/^([0-9a-zA-Z]){43}=$/.test(chance.wp8_anid2())))
})

// chance.wp7_anid()
test('wp7_anid() returns a proper windows phone 7 anid', t => {
    _.times(1000, () => t.true(/^A=[0-9A-F]{32}&E=[0-9a-f]{3}&W=\d$/.test(chance.wp7_anid())))
})

test('bb_pin() returns a proper blackberry pin', t => {
    _.times(1000, () => t.true(/([0-9a-f]){8}/.test(chance.bb_pin())))
})
