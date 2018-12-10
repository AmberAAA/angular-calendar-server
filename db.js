const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

let url = 'mongodb://test:test@127.0.0.1/admin?readPreference=primary'

let dbName = 'calendar';

const client = new MongoClient(url, {
  useNewUrlParser: true
});

let DB = null;

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
        console.dir(result.ops[0])
        resolve(result.ops[0])
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
      console.log(`success find: ${JSON.stringify(payload)}`)
      resolve(result)
    })
  })

  return cursor.toArray()

}

module.exports.deleteOne = function (payload) {
  if ( '_id' in payload.query) {
    payload.query._id = new ObjectID(payload.query._id)
  }
  return new Promise((resolve, reject) => {
	  DB.collection(payload.col).deleteOne(payload.query, payload.option, (err, result) => {
		  if (err) reject(err);
		  if (result.deletedCount === 1) console.log(`success delete: ${JSON.stringify(payload)}`);
		  resolve(result.deletedCount)
	  })
  })
};

module.exports.updateOne = function (payload) {
	if ( '_id' in payload.query) {
		payload.query._id = new ObjectID(payload.query._id)
	}
  return DB.collection(payload.col).findOneAndReplace({_id: payload.query._id}, payload.update, payload.option)
};

