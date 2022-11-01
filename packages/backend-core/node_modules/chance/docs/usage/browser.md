# browser

#### Easy

**Chance** instantiates itself onto the window. This means that in the simplest
case you can just include the script tag then use an instance of **Chance**
immediately.

```html
<script src="chance.js"></script>
<script>
    console.log(chance.bool());
</script>
```

The above snippet would result in either true or false being logged to your
console. Note how the instance is lowercase *chance*. Uppercase *Chance* is the
constructor which will create a new instance of **Chance**.

#### Intermediate

You can also ignore the global instantiation of **Chance** and create your own.
This allows you to create multiple instances if you'd like. For convenience, we
also bind **Chance** to window so it's accessible globally in the browser at
*window.Chance* or just *Chance*.

```html
<script src="chance.js"></script>
<script>
    var my_chance = new Chance();
    console.log(my_chance.bool());
</script>
```


#### Advanced

If you create your own instance of **Chance**, you can provide your own seed if
you would like to be repeatable or if you'd like a more truly random seed. In
the below example, I am doing an AJAX call to hit [Random.org][random] to
retrieve a *true* random number which I use to seed Chance.

```html
<script src="http://chancejs.com/chance.min.js"></script>
<script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
<script>
    var mySeed;
    $.get("https://www.random.org/integers/", {num: "1", col: "1", min: "1", max: "1000000000", base: "10", format: "plain", rnd: "new"}, function(randNum) {
      mySeed = randNum;

      // Instantiate Chance with this truly random number as the seed
      var my_seeded_chance = new Chance(mySeed);
      console.log(my_seeded_chance.natural());
    });
</script>
```

[random]: http://www.random.org
