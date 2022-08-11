# NAME

node-zlib - Simple, synchronous deflate/inflate for node.js buffers.



# USAGE

Install with `npm install zlib`.

    var Buffer = require('buffer').Buffer;
    var zlib = require('zlib');
    
    var input = new Buffer('lorem ipsum dolor sit amet');
    var compressed = zlib.deflate(input);
    var output = zlib.inflate(compressed);

Note that `node-zlib` is only intended for small (< 128 KB) data that you already have buffered. It is not meant for input/output streams.

# BUILDING

Make sure you have `zlib` installed. Mac OS X ships with it by default.

To obtain and build the bindings:

    git clone git://github.com/kkaefer/node-zlib.git
    cd node-zlib
    ./configure
    make

You can also use [`npm`](https://github.com/isaacs/npm) to download and install them:

    npm install zlib



# TESTS

[expresso](https://github.com/visionmedia/expresso) is required to run unit tests.

    npm install expresso
    make test



# CONTRIBUTORS

* [Konstantin Käfer](https://github.com/kkaefer)



# LICENSE

`node-zlib` is [BSD licensed](https://github.com/kkaefer/node-zlib/raw/master/LICENSE).
