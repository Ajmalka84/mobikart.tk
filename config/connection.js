const mongoClient = require('mongodb').MongoClient

const state = {
    db : null
}

module.exports.connect = function (done){
    let URL= 'mongodb+srv://ajmalka:ajmal123@cluster0.evh3lfs.mongodb.net/test'
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