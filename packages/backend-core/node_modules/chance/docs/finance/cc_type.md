# cc_type

```js
// usage
chance.cc_type()
chance.cc_type({raw: true})
```

Return a random credit card type.

```js
chance.cc_type();
=> 'Visa'
```

Default returns just the name. To return the entire object (consisting of name,
short name, numeric prefix, and length), specify so with the raw flag.

```js
chance.cc_type({raw: true});
=> {name: 'Discover Card', short_name: 'discover', prefix: '6011', length: 16}
```

The available types are (name - *short_name*):

* American Express - *amex*
* Bankcard - *bankcard*
* China UnionPay - *chinaunion*
* Diners Club Carte Blanche - *dccarte*
* Diners Club enRoute - *dcenroute*
* Diners Club International - *dcintl*
* Diners Club United States & Canada - *dcusc*
* Discover Card - *discover*
* InstaPayment - *instapay*
* JCB - *jcb*
* Laser - *laser*
* Maestro - *maestro*
* Mastercard - *mc*
* Solo - *solo*
* Switch - *switch*
* Visa - *visa*
* Visa Electron - *electron*
