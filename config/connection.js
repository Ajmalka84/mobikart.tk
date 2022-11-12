const mongoClient = require('mongodb').MongoClient

const state = {
    db : null
}

module.exports.connect = function (done){
    let URL= 'mongodb://127.0.0.1:27017'
    let dbname = 'MobiKart'

    mongoClient.connect(URL,(err,data)=>{
        if(err) return done(err);
        state.db= data.db(dbname);
        done();
    })
}

module.exports.get= function (){
    return state.db;
}