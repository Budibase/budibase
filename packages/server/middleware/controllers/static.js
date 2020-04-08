const couchdb = require("../../db");
const fs = require("fs");

const controller = {
  download: async ctx => {
    // const appDatabase = couchdb.db.use(ctx.params.appId)
    // appDatabase.attachment.get('rabbit', 'rabbit.png', function(err, body) {
    //   if (!err) {
    //     fs.writeFile('rabbit.png', body);
    //   }
    // });
  },
  upload: async ctx => {
    // const appDatabase = couchdb.db.use(ctx.params.appId)
    // fs.readFile('rabbit.png', function(err, data) {
    //   if (!err) {
    //     alice.attachment.insert('rabbit', 'rabbit.png', data, 'image/png',
    //       { rev: '12-150985a725ec88be471921a54ce91452' }, function(err, body) {
    //         if (!err)
    //           console.log(body);
    //     });
    //   }
    // });
  } 
}

module.exports = controller;