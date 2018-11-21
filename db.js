const MongoClient = require('mongodb').MongoClient;

let url = 'mongodb://test:test@104.225.237.158:27017/admin?readPreference=primary'

let dbName = 'calendar'

const client = new MongoClient(url)

let DB = null

module.exports.connect = function () {
  return new Promise((resolve, reject) => {
    client.connect(function(err) {
      if (err) reject(err);

      console.log("Connected successfully to server");

      DB = client.db(dbName);

      resolve(DB)
    });
  })
}

module.exports.findOne = function (payload) {
  return new Promise((resolve, reject) => {
    DB.collection(payload.col).findOne(payload.query, payload.option, (err, result) => {
      if (err) reject(err);
      console.log(`success findOne: ${JSON.stringify(payload)}`)
      resolve(result)
    })
  })
}

module.exports.insertOne = function (payload) {
  return new Promise((resolve, reject) => {
    DB.collection(payload.col).insertOne(payload.doc, payload.option, (err, result) => {
      if (err) {
        console.error(err)
        reject(err.code)
      } else {
        resolve(result)
      }
    })
  })
}

module.exports.remove = function (payload) {
  return new Promise((resolve, reject) => {
    DB.collection(payload.col).remove(payload.query, payload.option, (err, result) => {
      if (err) reject(err);
      console.log(`success remove: ${JSON.stringify(payload)}`)
      resolve(result)
    })
  })
}


module.exports.find = async function (payload) {

  const cursor = await new Promise((resolve, reject) => {
    DB.collection(payload.col).find(payload.query, payload.option, (err, result) => {
      if (err) reject(err);
      console.log(`success remove: ${JSON.stringify(payload)}`)
      resolve(result)
    })
  })

  return cursor.toArray()

}
