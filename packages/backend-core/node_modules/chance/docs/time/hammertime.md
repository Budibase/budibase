# hammertime

```js
// usage
chance.hammertime()
```

<p class="pullquote" data-pullquote='Stop. Hammertime.' markdown="1"></p>

Generate a random hammertime.

```js
chance.hammertime();
=> 2273327300317
```

Hammertime is the name given to a [Unix time](http://en.wikipedia.org/wiki/Unix_time) with
milliseconds. Which is the same as saying the number of milliseconds since 1970. It has
finer granularity than a normal Unix timestamp and thus is often used in realtime
applications.

According to startup lore, Hammertime was coined by a startup whose founder had an
interesting interaction with M.C. Hammer. There was no name given to "Unix time with
milliseconds" and while brainstorming ideas (because Unix time with milliseconds is
a confusing mouthful), someone suggested Hammertime and it stuck.
