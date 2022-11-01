# mixin

```js
// usage
chance.mixin(<Object>)
```

Mixins are a very powerful way to extend **Chance** to fit the needs of your
specific application.

First, if you are thinking of using a mixin for **Chance**, please consider first
whether your use is something from which others may benefit. If so, please
submit a [pull request][PR] rather than using a mixin!

Spread the love and give everyone the benefit of your awesome generator :)

Now, that said, there are bound to be times when you want to generate something
random that is specific to your application but not widely applicable. Enter
mixins!

**Chance** mixins allow you to add one-off methods to **Chance** which you can
use later.

For example, let's say I have a user object which consists of first, last,
and email.

```js

var user = {
first: 'John',
last: 'Smith',
email: 'john@aol.com'
};

```

Let's say I want to be able to randomly generate these user objects.

This is not the type of thing which would be widely applicable as it's specific
to my application so it's perfect for a mixin!

To create a mixin, build an object whose keys are the names of the methods, and
whose values are the functions to be called.

Note: Within each function, you will have access to `chance` itself!

For example, to create a `user` mixin:

```js
chance.mixin({
'user': function() {
return {
first: chance.first(),
last: chance.last(),
email: chance.email()
};
}
});

// Then you can call your mixin
chance.user();

=> {first: 'Eli', last: 'Benson', email: 'gembibuj@dugesan.com'}
```

Mixins can even include other mixins!

For example, to "extend" the user object:
```js
chance.mixin({
'user': function () {
return {
first: chance.first(),
last: chance.last(),
email: chance.email()
};
},
'social_user': function () {
var user = chance.user();
user.network = chance.pick(['facebook', 'twitter']);
return user;
}
});
```

So we have a second mixin here, `social_user` which is using the `user` mixin
and adding to it! Note, these mixins can be defined in any order on the object
if both declared at once.

[PR]: https://github.com/victorquinn/chancejs/pulls
