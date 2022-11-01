# cc

```js
// usage
chance.cc()
chance.cc({type: 'Mastercard'})
```

<p class="pullquote" data-pullquote='Somewhat obvious warning: Do not use this to hit live payment gateways...' markdown="1"></p>

Generate a random credit card number. This card number will pass the
[Luhn algorithm][Luhn] so it looks like a legit card.

```js
chance.cc();
=> '6304038511073827'
```

Optionally specify a particular type of card to return:

```js
chance.cc({type: 'Mastercard'});
=> '5171206237468496'
```

The type can be specified by the long name, or by the short name:

```js
chance.cc({type: 'mc'});
=> '5103820202214116'
```


The [types][types] are enumerated below.

[Luhn]: http://en.wikipedia.org/wiki/Luhn_algorithm
[types]: #cc_type
