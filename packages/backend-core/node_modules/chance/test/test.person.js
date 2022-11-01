import test from 'ava'
import Chance from '../chance.js'
import _ from 'lodash'

const chance = new Chance()

// age constants
const CHILD_AGE_MIN = 0
const CHILD_AGE_MAX = 12
const TEEN_AGE_MIN = 13
const TEEN_AGE_MAX = 19
const ADULT_AGE_MIN = 18
const ADULT_AGE_MAX = 65
const SENIOR_AGE_MIN = 65
const SENIOR_AGE_MAX = 100
const AGE_MIN = 0
const AGE_MAX = 100

const currentYear = new Date().getFullYear()

// chance.age()
test('age() returns a random age within expected bounds', t => {
    _.times(1000, () => {
        let age = chance.age()
        t.true(_.isNumber(age))
        t.true(age >= ADULT_AGE_MIN)
        t.true(age <= ADULT_AGE_MAX)
    })
})

test('age() returns a random age within expected bounds for all', t => {
    _.times(1000, () => {
        let age = chance.age({ type: 'all' })
        t.true(_.isNumber(age))
        t.true(age >= AGE_MIN)
        t.true(age <= AGE_MAX)
    })
})

test('age() returns a proper age for a child', t => {
    _.times(1000, () => {
        let age = chance.age({ type: 'child' })
        t.true(_.isNumber(age))
        t.true(age >= CHILD_AGE_MIN)
        t.true(age <= CHILD_AGE_MAX)
    })
})

test('age() returns a proper age for a teen', t => {
    _.times(1000, () => {
        let age = chance.age({ type: 'teen' })
        t.true(_.isNumber(age))
        t.true(age >= TEEN_AGE_MIN)
        t.true(age <= TEEN_AGE_MAX)
    })
})

test('age() returns a proper age for an adult', t => {
    _.times(1000, () => {
        let age = chance.age({ type: 'adult' })
        t.true(_.isNumber(age))
        t.true(age >= ADULT_AGE_MIN)
        t.true(age <= ADULT_AGE_MAX)
    })
})

test('age() returns a proper age for a senior', t => {
    _.times(1000, () => {
        let age = chance.age({ type: 'senior' })
        t.true(_.isNumber(age))
        t.true(age >= SENIOR_AGE_MIN)
        t.true(age <= SENIOR_AGE_MAX)
    })
})

// chance.birthday()
test('birthday() works as expected', t => {
    _.times(1000, () => {
        let birthday = chance.birthday()
        t.true(_.isDate(birthday))
        let year = birthday.getFullYear()
        let curYear = new Date().getFullYear()
        t.true(year > (curYear - AGE_MAX))
        t.true(year < curYear)
    })
})

test('birthday() can have a string returned', t => {
    _.times(1000, () => {
        let birthday = chance.birthday({ string: true })
        t.true(_.isString(birthday))
        t.false(_.isDate(birthday))
        t.true(/^[0-9][0-9]?\/[0-9][0-9]?\/[0-9]{4}/m.test(birthday))
    })
})

test('birthday() can have a year specified', t => {
    _.times(1000, () => {
        t.is(chance.birthday({ year: 1983 }).getFullYear(), 1983)
    })
})

test('birthday() can have an age range specified for an adult', t => {
    _.times(1000, () => {
        let birthday = chance.birthday({ type: 'adult' })
        let min = new Date().setFullYear(currentYear - ADULT_AGE_MAX - 1)
        let max = new Date().setFullYear(currentYear - ADULT_AGE_MIN)
        t.true(birthday.getTime() >= min)
        t.true(birthday.getTime() <= max)
    })
})

test('birthday() can have an age range specified for a teen', t => {
    _.times(1000, () => {
        let birthday = chance.birthday({ type: 'teen' })
        let min = new Date().setFullYear(currentYear - TEEN_AGE_MAX - 1)
        let max = new Date().setFullYear(currentYear - TEEN_AGE_MIN)
        t.true(birthday.getTime() >= min)
        t.true(birthday.getTime() <= max)
    })
})

test('birthday() can have an age range specified for a child', t => {
    _.times(1000, () => {
        let birthday = chance.birthday({ type: 'child' })
        let min = new Date().setFullYear(currentYear - CHILD_AGE_MAX - 1)
        let max = new Date().setFullYear(currentYear - CHILD_AGE_MIN)
        t.true(birthday.getTime() >= min)
        t.true(birthday.getTime() <= max)
    })
})

test('birthday() can have an age range specified for a senior', t => {
    _.times(1000, () => {
        let birthday = chance.birthday({ type: 'senior' })
        let min = new Date().setFullYear(currentYear - SENIOR_AGE_MAX - 1)
        let max = new Date().setFullYear(currentYear - SENIOR_AGE_MIN)
        t.true(birthday.getTime() >= min)
        t.true(birthday.getTime() <= max)
    })
})

// chance.cnpj()
test('cnpj() returns a random cnpj', t => {
    _.times(1000, () => {
        let hidn = chance.HIDN()
        t.true(_.isString(hidn))
    })
})

// chance.company()
test('company() returns a random company', t => {
    _.times(1000, () => {
        let company = chance.company()
        t.true(_.isString(company))
        t.true(company.length > 4)
    })
})

// chance.cpf()
test('cpf() returns a random valid taxpayer number for Brazil citizens (CPF)', t => {
    _.times(1000, () => {
        let cpf = chance.cpf()
        t.true(_.isString(cpf))
        t.true(/^\d{3}.\d{3}.\d{3}-\d{2}$/m.test(cpf))
        t.is(cpf.length, 14)
    })
})

// chance.first()
test('first() returns a random first name', t => {
    _.times(1000, () => {
        let first = chance.first()
        t.true(_.isString(first))
        t.true(first.length >= 2)
        t.true(first.length <= 20)
        t.is(first.split(' ').length, 1)
    })
})

// chance.gender()
test('gender() returns a random gender', t => {
    _.times(1000, () => t.true(/(Male|Female)/.test(chance.gender())))
})

test('gender() can take extra genders', t => {
    _.times(1000, () => {
        let gender = chance.gender({ extraGenders: ['Unknown', 'Transgender'] })
        t.true(/(Male|Female|Unknown|Transgender)/.test(gender))
    })
})

// chance.HIDN()
test('HIDN() returns a random HIDN', t => {
    _.times(1000, () => {
        let hidn = chance.HIDN()
        t.true(_.isString(hidn))
        t.true(/^\d{6}[A-Z]{2}$/m.test(hidn))
        t.is(hidn.length, 8)
    })
})

// chance.israelId()
test('israelId() returns a valid Isreal id', t => {
    let id = chance.israelId()
    t.true(_.isString(id))
    t.is(id.length, 9)
    let acc = 0
    for (let i = 0; i < 8; i++) {
        let thisDigit = id[i] * ( i / 2 === parseInt(i/2, 10) ? 1 : 2)
        thisDigit = chance.pad(thisDigit, 2)
        thisDigit = parseInt(thisDigit[0], 10) + parseInt(thisDigit[1], 10)
        acc += thisDigit
    }
    let lastDigit = (10 - parseInt(acc.toString().slice(-1), 10).toString().slice(-1)).toString().slice(-1)
    t.is(id[8], lastDigit)
})

// chance.last()
test('last() returns a random last name', t => {
    _.times(1000, () => {
        let last = chance.last()
        t.true(_.isString(last))
        t.true(last.length >= 2)
        t.true(last.length <= 20)
        t.true(last.split(' ').length <= 3)
    })
})

// chance.name()
test('name() returns a random name', t => {
    _.times(1000, () => {
        let name = chance.name()
        t.true(_.isString(name))
        t.true(name.length >= 2)
        t.true(name.length <= 30)
        t.is(name.split(' ').length, 2)
        t.true(/[a-zA-Z]+\ [a-zA-Z]+/.test(name))
    })
})

test('name() can have the middle name specified', t => {
    _.times(1000, () => {
        let name = chance.name({ middle: true })
        t.true(_.isString(name))
        t.is(name.split(' ').length, 3)
        t.true(/[a-zA-Z]+\ [a-zA-Z]+\ [a-zA-Z]+/.test(name))
    })
})

test('name() can have the middle initial specified', t => {
    _.times(1000, () => {
        let name = chance.name({ middle_initial: true })
        t.true(_.isString(name))
        t.is(name.split(' ').length, 3)
        t.true(/[a-zA-Z]+\ [a-zA-Z]\.\ [a-zA-Z]+/.test(name))
    })
})

test('name() can have the prefix specified', t => {
    _.times(1000, () => {
        let name = chance.name({ prefix: true })
        t.true(_.isString(name))
        t.is(name.split(' ').length, 3)
        t.true(/[a-zA-Z]{2,4}\.? [a-zA-Z]+\ [a-zA-Z]+/.test(name))
    })
})

test('name() can have the suffix specified', t => {
    _.times(1000, () => {
        let name = chance.name({ suffix: true })
        t.true(_.isString(name))
        t.is(name.split(' ').length, 3)
        t.true(/[a-zA-Z]+\ [a-zA-Z]+\ [a-zA-Z\.]+/.test(name))
    })
})

// chance.name_prefix()
test('name_prefix() returns a random prefix', t => {
    _.times(1000, () => {
        let prefix = chance.name_prefix()
        t.true(_.isString(prefix))
        t.true(prefix.length < 5)
    })
})

test('name_prefix() returns a correctly gendered prefix', t => {
    _.times(1000, () => {
        let prefix = chance.name_prefix({ gender: 'female' })
        t.not(prefix, 'Mr.')
        prefix = chance.name_prefix({ gender: 'male' })
        t.not(prefix, 'Mrs.')
        t.not(prefix, 'Miss')
    })
})

test('name_prefix() can return a full prefix', t => {
    _.times(1000, () => {
        let prefix = chance.name_prefix({ full: true })
        t.true(_.isString(prefix))
        t.true(prefix.length > 3)
    })
})

// chance.name_suffix()
test('name_suffix() returns a random suffix', t => {
    _.times(1000, () => {
        let suffix = chance.name_suffix()
        t.true(_.isString(suffix))
        t.true(suffix.length < 7)
    })
})

test('name_suffix() can return a full suffix', t => {
    _.times(1000, () => {
        let suffix = chance.name_suffix({ full: true })
        t.true(_.isString(suffix))
        t.true(suffix.length > 5)
    })
})

// chance.nationality()
test('nationality() returns a nationality that looks right', t => {
    _.times(1000, () => {
        let nationality = chance.nationality()
        t.true(_.isString(nationality))
        t.true(nationality.length > 3)
        t.true(nationality.length < 26)
    })
})

// chance.profession()
test('profession() returns a random profession', t => {
    _.times(1000, () => {
        let profession = chance.profession()
        t.true(_.isString(profession))
        t.true(profession.length > 3)
    })
})

test('profession() returns a ranked profession', t => {
    _.times(1000, () => {
        let profession = chance.profession({ rank: true })
        t.true(_.isString(profession))
        t.true(profession.split(' ').length > 1)
        t.true(/(Apprentice|Junior|Senior|Lead)/.test(profession.split(' ')[0]))
    })
})

// chance.ssn()
test('ssn() returns a random social security number', t => {
    _.times(1000, () => {
        let ssn = chance.ssn()
        t.true(_.isString(ssn))
        t.true(/^\d{3}-\d{2}-\d{4}$/m.test(ssn))
        t.is(ssn.length, 11)
    })
})

test('ssn() can return just the last 4', t => {
    _.times(1000, () => {
        let ssn = chance.ssn({ ssnFour: true })
        t.true(_.isString(ssn))
        t.true(/^\d{4}$/m.test(ssn))
        t.is(ssn.length, 4)
    })
})

// chance.aadhar()
test('aadhar() returns a random aadhar number with whitespace as separator', t => {
    _.times(1000, () => {
        let aadhar = chance.aadhar()
        t.true(_.isString(aadhar))
        t.true(/^\d{4}\s\d{4}\s\d{4}$/m.test(aadhar))
        t.is(aadhar.length, 14)
    })
})

// chance.aadhar({separatedByWhiteSpace : false})
test('aadhar() returns a random aadhar number with no separator', t => {
    _.times(1000, () => {
        let aadhar = chance.aadhar({separatedByWhiteSpace : false})
        t.true(_.isString(aadhar))
        t.true(/^\d{12}$/m.test(aadhar))
        t.is(aadhar.length, 12)
    })
})

// chance.aadhar({onlyLastFour : true})
test('aadhar() can return just the last 4', t => {
    _.times(1000, () => {
        let aadhar = chance.aadhar({ onlyLastFour: true })
        t.true(_.isString(aadhar))
        t.true(/^\d{4}$/m.test(aadhar))
        t.is(aadhar.length, 4)
    })
})

// chance.suffix()
test('suffix() returns a random suffix', t => {
    _.times(1000, () => {
        let suffix = chance.suffix()
        t.true(_.isString(suffix))
        t.true(suffix.length < 7)
    })
})

test('suffix() returns a full random suffix', t => {
    _.times(1000, () => {
        let suffix = chance.suffix({ full: true })
        t.true(_.isString(suffix))
        t.true(suffix.length > 5)
    })
})

// chance.mrz()
test('mrz() should return a valid passport number', t => {
    let sample = "P<GBRFOLKS<<JOANNE<<<<<<<<<<<<<<<<<<<<<<<<<<2321126135GBR6902069F1601013<<<<<<<<<<<<<<02"
    let mrz = chance.mrz({
        first: 'Joanne',
        last: 'Folks',
        gender: 'F',
        dob: '690206',
        expiry: '160101',
        passportNumber: '232112613',
    })
    t.is(sample, mrz)

    sample = "P<GBRKELLY<<LIDA<<<<<<<<<<<<<<<<<<<<<<<<<<<<3071365913GBR6606068F2003131<<<<<<<<<<<<<<04"
    mrz = chance.mrz({
        first: 'Lida',
        last: 'Kelly',
        gender: 'F',
        dob: '660606',
        expiry: '200313',
        passportNumber: '307136591',
    })
    t.is(sample, mrz)
})

test('mrz() should return a valid random passport number when not given any inputs', t => {
    let mrz = chance.mrz()
    t.true(_.isString(mrz))
    t.is(mrz.substr(0, 5), 'P<GBR')
    t.is(mrz.length, 88)
    t.true(/^[A-Z0-9<]{9}[0-9]{1}[A-Z]{3}[0-9]{7}[A-Z]{1}[0-9]{7}[A-Z0-9<]{14}[0-9]{2}$/.test(mrz.substr(44)))
})
