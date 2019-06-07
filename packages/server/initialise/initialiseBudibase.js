const create = require("./createMasterDb");
const argv = require("yargs").argv

const readline = require('readline');
const { promisify } = require('util');
const rimraf = promisify(require("rimraf"));
const fs = require("fs")

const mkdir = promisify(fs.mkdir);

readline.Interface.prototype.question[promisify.custom] = function(prompt) {
  return new Promise(resolve =>
    readline.Interface.prototype.question.call(this, prompt, resolve),
  );
};
readline.Interface.prototype.questionAsync = promisify(
  readline.Interface.prototype.question,
);


const question = async (q) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      var answer = await rl.questionAsync(q);
      rl.close();
      return answer;
}

(async () => {
    const datastore = argv.datastore 
                      ? argv.datastore
                      : await question("Datastore: ");


    if(!datastore) throw new Error("Datastore not supplied!");



    const username = argv.username 
                     ? argv.username
                     : await question("Owner Username: ");

    const password = argv.password 
                     ? argv.password
                     : await question("Owner Password: ");

    if(!username) throw new Error("Username not supplied!");
    if(!password) throw new Error("Password not supplied!");

    var datastoreModule = require("../../datastores/datastores/" + datastore);

    const rootconfig = {};
    for(let parameter in datastoreModule.configParameters) {
        rootconfig[parameter] = argv[parameter] 
                                ? argv[parameter]
                                : await question(`${datastoreModule.configParameters[parameter]}: `);
    }

    const cleanDev = argv.cleanDev ? true : false;

    if(cleanDev) {
      try {
        await rimraf(rootconfig.rootPath);
      }
      catch(_){}
      await mkdir(rootconfig.rootPath);
    }

    await create(
        datastoreModule,
        rootconfig,
        username,
        password)
})()