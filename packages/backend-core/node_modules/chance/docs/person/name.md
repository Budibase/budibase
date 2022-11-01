# name

```js
// usage
chance.name()
chance.name({ middle: true })
chance.name({ middle_initial: true })
chance.name({ prefix: true })
chance.name({ nationality: 'en' })
```

Generate a random name

```js
  chance.name();
  => 'Dafi Vatemi'
```

Optionally include the middle name

```js
  chance.name({ middle: true });
  => 'Nelgatwu Powuku Heup'
```


Optionally include the middle initial

```js
  chance.name({ middle_initial: true });
  => 'Ezme I Iza'
```

Optionally include the prefix

```js
  chance.name({ prefix: true });
  => 'Doctor Suosat Am'
```

Optionally include the suffix

```js
  chance.name({ suffix: true });
  => 'Fanny Baker Esq.'
```

Optionally specify a gender

```js
  chance.name({ gender: 'male' });
  => "Patrick Copeland"
```

Optionally specify a nationality

```js
  chance.name({ nationality: 'it' });
  => "Roberta Mazzetti"
```

Note, currently support for nationality is limited to: `'en', 'it'`.

