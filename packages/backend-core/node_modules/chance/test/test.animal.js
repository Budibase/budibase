import test from 'ava'
import Chance from '../chance.js'
import _ from 'lodash'

const chance = new Chance()

const timeout = (seconds) => {
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(), seconds)
  })
}

//chance.animal()

test('returns an animal', t => {
  _.times(1000, () => {
    let animal = chance.animal({
      type: "desert"
    })
    t.true(_.isString(animal))
    t.true(animal.length >= 2)
  })
})

test('returns an animal even if type is not specified', t => {
  _.times(1000, () => {
    let animal = chance.animal()
    t.true(_.isString(animal))
    t.true(animal.length >= 2)
  })
})

test('throws an error if the type is not part of the animals object', t => {
  _.times(1000, () => {
    const fn = () => chance.animal({
      type: "banana"
    })
    t.throws(fn, "Please pick from desert, ocean, grassland, forest, zoo, pets, farm.")
  })
})
