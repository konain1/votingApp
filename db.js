
const mongoose = require('mongoose')
require('dotenv').config()
const mongoLocalURL = 'mongodb://127.0.0.1:27017/voter'
const mongoOnlineUrl = process.env.DB_URL

const mongodbURL = mongoose.connect(mongoOnlineUrl+"/votingApp")

const db = mongoose.connection;
db.on('connected',()=>console.log('mongo is connected'))
db.on('error',(err)=>console.log('mongo has erro = ',err))
db.on('disconnected',()=>console.log('mongo is disconnected'))

module.exports = db