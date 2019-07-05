const fs = require("fs");

module.exports = (config) => ({
    main: {
        outputToFile : ({filename, content}) => {
            fs.writeFile(`./tests/.data/${filename}`, content, {encoding:"utf8"});
        }
    }
})